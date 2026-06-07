from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Category model to categorize products
class Category(models.Model):
    CATEGORY_CHOICES=[
        ('all', 'All'),
        ('homemade_foods', 'Homemade Foods'),
        ('fresh_groceries', 'Fresh Groceries'),
        ('traditional_snacks', 'Traditional Snacks'),
        ('kitchen_essentials', 'Kitchen Essentials'),
    ]
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, unique=True)

    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name
     

# Product model to represent products in the store
class Product(models.Model):
    BADGE_CHOICES = [
        ('best_seller', 'Best Seller'),
        ('new',         'New'),
        ('sale',        'Sale'),
        ('featured',    'Featured'),
        ('none',        'None'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='products')
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    reviews = models.IntegerField(default=0)
    stock = models.IntegerField(default=0)
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, default='none')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def is_in_stock(self):
        return self.stock > 0
    
    @property
    def is_on_sale(self):
        return self.badge == 'sale'