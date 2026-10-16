from django.db.models import Count
from rest_framework import viewsets

from .models import Category, Product
from .permissions import IsAdminOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(product_count=Count('products'))
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    """
    Public product browsing; admin-only management.

    Query params:
      - search            name / sku / description
      - category          category slug
      - material          material filter
      - ordering          price, -price, -created_at, name
      - featured          true to return featured items only
    """
    queryset = Product.objects.select_related('category')
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    filterset_fields = ['material', 'category__slug']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        # Admin browsing (the studio) needs the full record to edit inline.
        user = self.request.user
        if self.action == 'list' and user.is_authenticated and user.is_admin_role:
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        # Shoppers only ever see active products; admins see everything.
        if not (params.get('include_inactive') and self.request.user.is_admin_role):
            qs = qs.filter(is_active=True)
        slug = params.get('category')
        if slug:
            qs = qs.filter(category__slug=slug)
        if params.get('featured') == 'true':
            qs = qs.filter(featured=True)
        return qs
