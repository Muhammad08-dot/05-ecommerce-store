from django.contrib import admin

from .models import Category, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'stock', 'featured', 'is_active')
    list_filter = ('category', 'material', 'featured', 'is_active')
    search_fields = ('name', 'sku')
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Category)
