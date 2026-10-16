from django.conf import settings
from django.db import models

from catalog.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending payment'
        PAID = 'paid', 'Paid'
        FULFILLED = 'fulfilled', 'Fulfilled'
        CANCELLED = 'cancelled', 'Cancelled'

    reference = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='orders',
        on_delete=models.CASCADE, null=True, blank=True,
    )
    email = models.EmailField()
    shipping_name = models.CharField(max_length=140)
    shipping_address = models.CharField(max_length=200)
    shipping_city = models.CharField(max_length=80)
    shipping_postal = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=60, default='United States')

    subtotal_cents = models.PositiveIntegerField()
    shipping_cents = models.PositiveIntegerField()
    tax_cents = models.PositiveIntegerField()
    grand_total_cents = models.PositiveIntegerField()

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    stripe_payment_intent = models.CharField(max_length=60, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.reference

    @staticmethod
    def next_reference():
        """Human-readable order number like HD-2026-0148."""
        from django.utils import timezone
        year = timezone.now().year
        count = Order.objects.filter(reference__startswith=f'HD-{year}-').count() + 1
        return f'HD-{year}-{count:04d}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.PROTECT)
    name = models.CharField(max_length=140)   # snapshot at purchase time
    sku = models.CharField(max_length=30)
    unit_price_cents = models.PositiveIntegerField()
    qty = models.PositiveIntegerField()

    @property
    def line_total_cents(self):
        return self.unit_price_cents * self.qty
