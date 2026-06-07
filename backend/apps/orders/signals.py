# apps/orders/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderStatusHistory

@receiver(post_save, sender=Order)
def create_status_history(sender, instance, created, **kwargs):
    """Auto-log every status change to OrderStatusHistory."""
    if created:
        OrderStatusHistory.objects.create(
            order=instance,
            from_status='',
            to_status=instance.status,
            note='Order created.'
        )

# In Phase 5 we'll add:
# - send confirmation email via (suggested: Celery)
# - push WebSocket notification via Django Channels
# For now, the signal hook is the right place for those.