from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('reference', 'email', 'grand_total_cents', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('reference', 'email', 'shipping_name')
    inlines = [OrderItemInline]
