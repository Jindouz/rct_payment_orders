from django.shortcuts import render
from rest_framework import serializers
from rest_framework.response import Response
from base.models import Category, Order, OrderDetail, Product
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.models import User
from rest_framework import status
from django.core.files.storage import default_storage
from django.db.models import Q

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.shortcuts import redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics, permissions



@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get('email')
    user = get_object_or_404(User, email=email)
    token = default_token_generator.make_token(user)
    reset_url = f"http://localhost:3000/resetconfirm/{user.id}/{token}"
    send_mail(
        'Password Reset',
        f'Please click the following link to reset your password: {reset_url}',
        'jindouz@rr4.de',
        [user.email],
        fail_silently=False,
    )
    return Response({'message': 'Password reset email sent'})


@api_view(['POST'])
def password_reset_confirm(request, user_id, token):
    user = get_object_or_404(User, pk=user_id)
    if default_token_generator.check_token(user, token):

        new_password = request.data.get('new_password')
        # print(new_password)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successfully'})
    else:
        return Response({'error': 'Invalid token'}, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_public(req,id=-1):
    if req.method =='GET':
        print(req) 

        if id > -1:
            try:
                temp_product=Product.objects.get(id=id)
                return Response (ProductSerializer(temp_product,many=False).data)
            except Product.DoesNotExist:
                return Response ("not found")
        all_products=ProductSerializer(Product.objects.all(),many=True).data
        return Response (all_products)
    

@api_view(['GET','POST','DELETE','PUT','PATCH'])
@permission_classes([IsAuthenticated])
def products(req,id=-1):
    print(req.user)
    
    if req.method == 'GET':
        search_query = req.query_params.get('search', None)

        if id > -1:
            try:
                temp_product = Product.objects.get(id=id)
                return Response(ProductSerializer(temp_product, many=False).data)
            except Product.DoesNotExist:
                return Response("not found")

        queryset = Product.objects.all()

        if search_query:
            queryset = queryset.filter(Q(Name__icontains=search_query))

        all_products = ProductSerializer(queryset, many=True).data
        return Response(all_products)
    
    if req.method == 'POST':
        print(req.data)
        tsk_serializer = ProductSerializer(data=req.data)
        if tsk_serializer.is_valid():
            tsk_serializer.save()

            # The serializer instance has been updated after saving
            temp_product = tsk_serializer.instance

            # Handle file upload within the serializer's create method
            tsk_serializer = ProductSerializer(temp_product, data=req.data)
            if tsk_serializer.is_valid():
                tsk_serializer.save()

                return Response("posted")
            else:
                return Response(tsk_serializer.errors)

        else:
            return Response(tsk_serializer.errors)
    if req.method =='DELETE':
        try:
            temp_product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response("not found")

        # Delete the associated image file
        if temp_product.img:
            default_storage.delete(temp_product.img.path)

        temp_product.delete()
        return Response("deleted")
    if req.method in ['PUT', 'PATCH']:
        print(req.data)
        try:
            temp_product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response("not found", status=status.HTTP_404_NOT_FOUND)

        # Update the serializer (this also saves the instance)
        api_serializer = ProductSerializer(temp_product, data=req.data, partial=True)

        if api_serializer.is_valid():
            api_serializer.save()
            # Get the old image path before updating the serializer
            old_image_path = temp_product.img.path if temp_product.img else None

            # Handle file upload
            image_file = req.data.get('img')
            if image_file:
                # Delete old image if it exists
                if old_image_path and default_storage.exists(old_image_path):
                    default_storage.delete(old_image_path)

                # Manually update the image field
                temp_product.img = image_file
                temp_product.save()

            return Response(api_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(api_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
    

#====Login====
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
 
        # Add custom claims
        token['username'] = user.username
        token['admin'] = user.is_superuser
        # ...
 
        return token
 
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        print("Request data:", request.data)
        response = super().post(request, *args, **kwargs)
        print("Response data:", response.data)
        return response


@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
                username=request.data['username'],
                password=request.data['password'],
                email=request.data['email'],
            )
    user.save()
    return Response("new user created")

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token = request.data.get('refreshToken')

    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=400)

    try:
        # Attempt to refresh the access token using the provided refresh token
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({'access': access_token}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

#======Product/Category Serializers=========

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'img']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

        
 #======Orders========

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['product', 'quantity', 'price_per']

class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)

    class Meta:
        model = Order
        fields = ['user', 'total_price', 'paypal_order_id', 'order_details']
        read_only_fields = ['user', 'paypal_order_id']

    def create(self, validated_data):
        order_details_data = validated_data.pop('order_details')
        total_price = validated_data.pop('total_price')
        paypal_order_id = validated_data.pop('paypal_order_id', None)  # Extract paypal_order_id if provided

        order = Order.objects.create(total_price=total_price, paypal_order_id=paypal_order_id, **validated_data)
        
        for order_detail_data in order_details_data:
            OrderDetail.objects.create(order=order, **order_detail_data)
        
        return order
class OrderListCreate(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure user is authenticated

    def perform_create(self, serializer):
        # Extract the paypal_order_id from the request data
        paypal_order_id = self.request.data.get('paypal_order_id', None)
        
        # Pass the extracted paypal_order_id to the serializer
        serializer.save(user=self.request.user, paypal_order_id=paypal_order_id)