from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CartSerializer


class CartQuoteView(APIView):
    """
    Stateless cart quote. Accepts the shopper's line items and returns
    server-authoritative pricing (subtotal, shipping, tax, grand total).
    The frontend never trusts its own totals for payment.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'lines': serializer.validated_data['lines'],
                         'totals': serializer.validated_data['totals']})
