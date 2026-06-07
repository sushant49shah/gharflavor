from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.validators import MinValueValidator
from django.db.models import F

# Create your models here.

# Address model to store user addresses for shipping
class Address(models.Model):
    user         = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)
    label        = models.CharField(max_length=50, default='Home')   # Home / Office / etc.
    full_name    = models.CharField(max_length=150)
    phone        = models.CharField(max_length=20)
    street       = models.CharField(max_length=255)
    city         = models.CharField(max_length=100)
    state        = models.CharField(max_length=100)
    postal_code  = models.CharField(max_length=20)
    country      = models.CharField(max_length=100, default='Nepal')
    is_default   = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "addresses"
    
    def save(self, *args, **kwargs):
        # Enforce only one default address per user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.label} — {self.user.email}"
    
def generate_order_number():
    """Human-readable: ORD-2026-XXXXX"""
    from django.utils import timezone
    year = timezone.now().year
    uid  = uuid.uuid4().hex[:6].upper()
    return f"ORD-{year}-{uid}"

# Order model to represent customer orders which includes address, order items, payment method, and financial details
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING     = 'pending',     'Pending'
        CONFIRMED   = 'confirmed',   'Confirmed'
        PROCESSING  = 'processing',  'Processing'
        SHIPPED     = 'shipped',     'Shipped'
        DELIVERED   = 'delivered',   'Delivered'
        CANCELLED   = 'cancelled',   'Cancelled'
        REFUNDED    = 'refunded',    'Refunded'
        PENDING_COD = 'pending_cod', 'Pending (Cash on Delivery)'

    class PaymentMethod(models.TextChoices):
        CARD   = 'card',  'Card'
        PAYPAL = 'paypal', 'PayPal'
        ESEWA  = 'esewa',  'eSewa'
        COD    = 'cod',    'Cash on Delivery'

    class PaymentStatus(models.TextChoices):
        PENDING   = 'pending',   'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED    = 'failed',    'Failed'

    # core fields
    order_number     = models.CharField(
                           max_length=30, unique=True,
                           default=generate_order_number, editable=False
                       )
    user             = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    shipping_address = models.ForeignKey(
                           Address, on_delete=models.PROTECT,
                           related_name='orders'
                       )
    status           = models.CharField(
                           max_length=20,
                           choices=Status.choices,
                           default=Status.PENDING,
                           db_index=True
                       )
    payment_method   = models.CharField(max_length=10, choices=PaymentMethod.choices)
    payment_status   = models.CharField(
                           max_length=20,
                           choices=PaymentStatus.choices,
                           default=PaymentStatus.PENDING,
                           db_index=True
                       )
    inventory_deducted = models.BooleanField(default=False)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    # ── Financials (always snapshot at time of purchase) ─────
    subtotal         = models.DecimalField(max_digits=10, decimal_places=2)
    discount         = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total            = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    
    # ── State machine transitions ─────────────────────────────
    # Explicit methods instead of raw `.save()` on status —
    # this is where you'll fire signals, Celery tasks, and
    # WebSocket pushes in Phase 5.
    
    VALID_TRANSITIONS = {
        Status.PENDING:     [Status.CONFIRMED, Status.CANCELLED],
        Status.PENDING_COD: [Status.CONFIRMED, Status.CANCELLED],
        Status.CONFIRMED:   [Status.PROCESSING, Status.CANCELLED],
        Status.PROCESSING:  [Status.SHIPPED, Status.CANCELLED],
        Status.SHIPPED:     [Status.DELIVERED],
        Status.DELIVERED:   [Status.REFUNDED],
        Status.CANCELLED:   [],
        Status.REFUNDED:    [],
    }

    def transition_to(self, new_status, save=True):
        allowed = self.VALID_TRANSITIONS.get(self.status, [])
        if new_status not in allowed:
            raise ValueError(
                f"Cannot transition order from '{self.status}' to '{new_status}'."
            )
        self.status = new_status
        if save:
            self.save(update_fields=['status', 'updated_at'])
        return self

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.status == self.Status.SHIPPED and not self.inventory_deducted:
            did_claim_inventory = type(self).objects.filter(pk=self.pk, inventory_deducted=False).update(
                inventory_deducted=True
            )
            if did_claim_inventory:
                self.deduct_inventory()
                self.inventory_deducted = True

    def deduct_inventory(self):
        from apps.products.models import Product

        for item in self.items.select_related('variant'):
            Product.objects.filter(pk=item.variant_id).update(
                stock=F('stock') - item.quantity
            )

    def confirm(self):    return self.transition_to(self.Status.CONFIRMED)
    def process(self):    return self.transition_to(self.Status.PROCESSING)
    def ship(self):       return self.transition_to(self.Status.SHIPPED)
    def deliver(self):    return self.transition_to(self.Status.DELIVERED)
    def cancel(self):     return self.transition_to(self.Status.CANCELLED)
    def refund(self):     return self.transition_to(self.Status.REFUNDED)

    def __str__(self):
        return f"{self.order_number} — {self.user.first_name}"
    
# Order Items
class OrderItem(models.Model):
    order         = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    variant       = models.ForeignKey(
                        'products.Product',
                        on_delete=models.PROTECT   # never delete a variant that's been ordered
                    )

    # ── Snapshot fields — critical ────────────────────────────
    # Product names and prices change over time.
    # We store the values AS THEY WERE at purchase time.
    # Never derive these from the live variant in order history.
    product_name  = models.CharField(max_length=255)
    variant_name  = models.CharField(max_length=100)   # e.g. "Red / XL"
    unit_price    = models.DecimalField(max_digits=10, decimal_places=2)
    quantity      = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    line_total    = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.line_total = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}× {self.product_name}"
    

# Audit log of every status change — essential for customer support and analytics.
class OrderStatusHistory(models.Model):
    order       = models.ForeignKey(Order, related_name='history', on_delete=models.CASCADE)
    from_status = models.CharField(max_length=20, blank=True)
    to_status   = models.CharField(max_length=20)
    note        = models.TextField(blank=True)    # e.g. "Dispatched via Aramex, AWB: 123"
    changed_by  = models.ForeignKey(
                      User, null=True, blank=True,
                      on_delete=models.SET_NULL
                  )
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Order {self.order.order_number}: {self.from_status} → {self.to_status}"
    
    
