from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ContactMessage(models.Model):
    INQUIRY_CHOICES = [
        ('general', 'General Inquiry'),
        ('customer_support', 'Customer Support'),
        ('become_a_chef', 'Become a Chef'),
        ('corporate_tiffin', 'Corporate Tiffin'),
        ('other', 'Other'),
    ]
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    inquiry_type = models.CharField(max_length=100, choices=INQUIRY_CHOICES, unique=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} - ({self.email}) ({self.inquiry_type})"