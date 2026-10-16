from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CheckoutView, MarkPaidView, OrderViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/<str:reference>/mark-paid/', MarkPaidView.as_view(), name='order-mark-paid'),
] + router.urls
