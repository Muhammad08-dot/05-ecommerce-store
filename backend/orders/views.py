import uuid

import stripe
from django.conf import settings
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import CheckoutSerializer, OrderSerializer


def _create_payment_intent(amount_cents, reference):
    """
    Create a Stripe PaymentIntent in TEST MODE.

    When real test keys are configured, this returns a live client_secret the
    frontend confirms with Stripe Elements. With placeholder keys (the default
    demo state) it returns a simulated secret so the checkout flow stays runnable.
    """
    key = settings.STRIPE_SECRET_KEY
    if key.startswith('sk_test_placeholder'):
        return {
            'id': f'pi_demo_{uuid.uuid4().hex[:16]}',
            'client_secret': f'pi_demo_secret_{uuid.uuid4().hex[:16]}',
            'simulated': True,
        }
    stripe.api_key = key
    intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency='usd',
        metadata={'order_reference': reference},
        automatic_payment_methods={'enabled': True},
    )
    return {'id': intent.id, 'client_secret': intent.client_secret, 'simulated': False}


class CheckoutView(APIView):
    """
    Create an order from the cart, then open a Stripe PaymentIntent.

    Guests may check out; a logged-in user's order is attached to their account.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        order = serializer.create_order(user=user)
        intent = _create_payment_intent(order.grand_total_cents, order.reference)
        order.stripe_payment_intent = intent['id']
        order.save(update_fields=['stripe_payment_intent'])
        return Response({
            'order': OrderSerializer(order).data,
            'payment': intent,
        }, status=status.HTTP_201_CREATED)


class MarkPaidView(APIView):
    """
    Demo payment confirmation endpoint. In production this is replaced by a
    Stripe webhook that flips the order to paid once the PaymentIntent settles.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, reference):
        order = Order.objects.filter(reference=reference).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=404)
        order.status = Order.Status.PAID
        order.save(update_fields=['status'])
        return Response(OrderSerializer(order).data)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Order history. Users see their own orders; admins see all."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Order.objects.prefetch_related('items')
        if self.request.user.is_admin_role:
            return qs
        return qs.filter(user=self.request.user)
