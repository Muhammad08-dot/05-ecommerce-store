from rest_framework import serializers

from cart.serializers import CartSerializer
from catalog.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total_cents = serializers.IntegerField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'name', 'sku', 'unit_price_cents', 'qty', 'line_total_cents')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'reference', 'email', 'shipping_name', 'shipping_address',
            'shipping_city', 'shipping_postal', 'shipping_country', 'status',
            'status_display', 'subtotal_cents', 'shipping_cents', 'tax_cents',
            'grand_total_cents', 'items', 'created_at',
        )
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):
    """Validates checkout input; totals come only from the server quote."""
    email = serializers.EmailField()
    shipping_name = serializers.CharField(max_length=140)
    shipping_address = serializers.CharField(max_length=200)
    shipping_city = serializers.CharField(max_length=80)
    shipping_postal = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=60, required=False, default='United States')
    items = serializers.JSONField()

    def validate_items(self, value):
        cart = CartSerializer(data={'items': value})
        cart.is_valid(raise_exception=True)
        self._cart = cart.validated_data
        return value

    def create_order(self, user=None):
        from django.db import transaction
        cart = self._cart
        totals = cart['totals']
        with transaction.atomic():
            order = Order.objects.create(
                reference=Order.next_reference(),
                user=user,
                email=self.validated_data['email'],
                shipping_name=self.validated_data['shipping_name'],
                shipping_address=self.validated_data['shipping_address'],
                shipping_city=self.validated_data['shipping_city'],
                shipping_postal=self.validated_data['shipping_postal'],
                shipping_country=self.validated_data.get('shipping_country', 'United States'),
                subtotal_cents=totals['subtotal_cents'],
                shipping_cents=totals['shipping_cents'],
                tax_cents=totals['tax_cents'],
                grand_total_cents=totals['grand_total_cents'],
            )
            items = []
            for line in cart['lines']:
                items.append(OrderItem(
                    order=order,
                    product_id=line['product_id'],
                    name=line['name'],
                    sku=line['sku'],
                    unit_price_cents=line['unit_price_cents'],
                    qty=line['qty'],
                ))
            OrderItem.objects.bulk_create(items)
            # Decrement stock now that the order is committed.
            for line in cart['lines']:
                Product.objects.filter(pk=line['product_id']).update(
                    stock=Product.objects.get(pk=line['product_id']).stock - line['qty']
                )
        return order
