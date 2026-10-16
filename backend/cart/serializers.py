from rest_framework import serializers

from catalog.models import Product

FREE_SHIPPING_CENTS = 12000  # orders at/above $120 ship free
FLAT_SHIPPING_CENTS = 900    # otherwise a flat $9
TAX_RATE = 0.08              # 8% demo tax


class CartItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    qty = serializers.IntegerField(min_value=1, max_value=99)


class CartSerializer(serializers.Serializer):
    """Validates a list of {product_id, qty} against live prices and stock."""
    items = serializers.ListField(child=CartItemInputSerializer(), allow_empty=False)

    def validate(self, attrs):
        products = Product.objects.in_bulk([i['product_id'] for i in attrs['items']])
        lines = []
        for entry in attrs['items']:
            product = products.get(entry['product_id'])
            if not product or not product.is_active:
                raise serializers.ValidationError(
                    f"Product {entry['product_id']} is not available."
                )
            if product.stock < entry['qty']:
                raise serializers.ValidationError(
                    f"Only {product.stock} left of {product.name}."
                )
            line_total = product.price_cents * entry['qty']
            lines.append({
                'product_id': product.id,
                'name': product.name,
                'slug': product.slug,
                'sku': product.sku,
                'image_url': product.image_url,
                'unit_price_cents': product.price_cents,
                'qty': entry['qty'],
                'line_total_cents': line_total,
            })
        subtotal = sum(l['line_total_cents'] for l in lines)
        shipping = 0 if subtotal >= FREE_SHIPPING_CENTS else FLAT_SHIPPING_CENTS
        tax = int(round(subtotal * TAX_RATE))
        attrs['lines'] = lines
        attrs['totals'] = {
            'subtotal_cents': subtotal,
            'shipping_cents': shipping,
            'tax_cents': tax,
            'grand_total_cents': subtotal + shipping + tax,
        }
        return attrs
