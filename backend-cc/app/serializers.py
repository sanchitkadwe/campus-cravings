import uuid
from rest_framework import serializers
from .models import User,MenuItem,ActiveOrder,CartItem,Payment,Category, Store,OrderItem,OrderHistory,OrderItemHistory,DummyPayment


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= ['name','phone_number','hostel']
        extra_kwargs = {'password': {'write_only': True}}


class ActiveOrderSerializer(serializers.ModelSerializer):
    ordered_by = UserSerializer()
    class Meta:
        model = ActiveOrder
        fields = ['id', 'ordered_by', 'total_price', 'status', 'order_time']

class PaymentSerializer(serializers.ModelSerializer):
    order = ActiveOrderSerializer()
    
    class Meta:
        model = Payment
        fields = ['order', 'status', 'payment_time', 'transaction_id']
    
    def create(self, validated_data):
        order_data = validated_data.pop('order')
        order = ActiveOrder.objects.create(**order_data)
        payment = Payment.objects.create(order=order, **validated_data)
        return payment



class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    class Meta:
        model = MenuItem
        fields = ['id','item_name', 'price', 'category','available']

    def validate_price(self,value):
        if value<=0 :
            raise serializers.ValidationError("Price must be greater than 0.")
        return value
    
class CartItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer()
    class Meta:
        model = CartItem
        fields = ['menu_item', 'quantity', 'total_price']

    def validate_quantity(self, value):
        if value<1:
            raise serializers.ValidationError("Quantity must be atleast 1.")
        
        return value

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_number']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer()
    class Meta : 
        model = OrderItem 
        fields = ['menu_item','quantity']

class OrderItemHistory(serializers.Serializer):
    class Meta : 
        model = OrderItemHistory
        fields = '__all__'

class OrderHistorySerializer(serializers.ModelSerializer):
    class Meta : 
        model = OrderHistory
        fields = '__all__'


class PaymentInitiateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DummyPayment
        fields = ['amount', 'currency', 'status']  # Add other fields as needed
        read_only_fields = ['status', 'transaction_id', 'user']
    
    def create(self, validated_data):
        # Get the user from the request context
        user = self.context['request'].user
        
        # Create payment with generated transaction ID
        payment = DummyPayment.objects.create(
            user=user,
            transaction_id=str(uuid.uuid4()),
            **validated_data
        )
        return payment


