from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'blurb', 'product_count')


class ProductListSerializer(serializers.ModelSerializer):
    """Compact payload for grid cards."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'sku', 'category', 'category_name',
            'material', 'price', 'image_url', 'image_alt', 'in_stock', 'featured',
        )


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'sku', 'category', 'category_name', 'category_slug', 'description',
            'care', 'material', 'price', 'price_cents', 'image_url', 'image_alt',
            'stock', 'in_stock', 'featured', 'is_active', 'created_at',
        )
