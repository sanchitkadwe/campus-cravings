import base64
import hashlib
import json
import time
import requests
import uuid
from rest_framework import viewsets
from .models import User, Category, MenuItem, CartItem, ActiveOrder, Payment, Store,OrderItem,OrderItemHistory,OrderHistory
from .serializers import UserSerializer, CategorySerializer, MenuItemSerializer, CartItemSerializer, ActiveOrderSerializer, PaymentSerializer,StoreSerializer,LoginSerializer,OrderHistorySerializer,OrderItemSerializer
from rest_framework.decorators import action
from rest_framework import status 
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sessions.models import Session
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .authentication import CookieJWTAuthentication  
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Sum
from .permissions import IsAdmin, IsUser
from .serializers import PaymentInitiateSerializer


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes=[IsAdmin]
    authentication_classes=[CookieJWTAuthentication]

    @action(detail=False,methods=['get'])
    def getstorestatus(self,request,permisssion_classes=[AllowAny]):
        try: 
            store = Store.objects.get(id=1)
            return Response({"status":store.is_open},status=status.HTTP_200_OK)



        except Exception as e :
            return Response({"error":str(e)},status=status.HTTP_401_UNAUTHORIZED)


    @action(detail=False, methods=['put'])
    def togglestore(self, request):
        user = request.user 
        try :
            store = Store.objects.get(id=1)
            store.is_open = not store.is_open
            store.save()
            return Response({store.is_open},status=status.HTTP_200_OK)
        
        except Exception as e :
            return Response({"error":str(e)},status=status.HTTP_401_UNAUTHORIZED)
    


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


    # @action(detail=False, methods=['get'])
    # def getuser(self,request):
    #     user = request.user
    #     return user.role=='canteen_manager'
        


    @action( detail= False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")


        try:
            user = User.objects.get(phone_number=phone_number)

            if not check_password(password,user.password):
                return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                refresh = RefreshToken.for_user(user)
                access_token= str(refresh.access_token)
             
    
                response = Response({
                "message": "Login successful!",
                "role": user.role=='canteen_manager',
                }, status=status.HTTP_200_OK)
                
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,  # Set to False for development
                    samesite='LaX',
                    path='/'
                )
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=False,
                    samesite='LaX',
                    path='/',
                )

                return response


        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['post'], authentication_classes=[CookieJWTAuthentication])
    def logout(self, request):
        response = Response({"message": "Logout successful!"}, status=200)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')


        return response
    

    @action(detail= False, methods=['post'], permission_classes =[AllowAny])
    def signup(self, request):
        name = request.data.get("name")
        phone_number = request.data.get("phone_number")
        hostel = request.data.get("hostel")
        password = request.data.get("password")
        role = "user"

        if not all([name, phone_number, hostel, password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)

        try:
            user = User.objects.create(
                name=name,
                phone_number=phone_number,
                hostel=hostel,
                role=role,
                password=hashed_password,
            )

            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    @action(detail= False,methods=['get'],authentication_classes=[CookieJWTAuthentication])
    def myinfo(self, request):
        user = request.user 
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]






class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes= [AllowAny]
    http_method_names=['get','delete']
    
    @action(detail=False, methods=['get'])
    def getmenu(self,request):
        category = request.GET.get('category',None)

        if not category or category=="all":    
            menu_items = MenuItem.objects.all()

        else :
            menu_items = MenuItem.objects.filter(category__category_name=category)

        serialized_data = MenuItemSerializer(menu_items, many=True) 
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    



                                                 


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes= [CookieJWTAuthentication]


    @action(detail= False, methods= ['get'])
    def mycart(self,request):
        user = request.user
        try: 
            cart_items = CartItem.objects.filter(user=user).select_related('menu_item')
            total_price = sum(item.total_price for item in user.cart_items.all())
            serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
            return Response({"items":serializer.data,"total_price":total_price}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},  
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False,methods=['post'])
    def addtocart(self, request):
        user = request.user
        menu_item = request.data.get('id')  # More descriptive name
        quantity = request.data.get('quantity')

        if not menu_item or not quantity:
            return Response(
                {"error": "Both item_id and quantity are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
            if quantity <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            menu_item = MenuItem.objects.get(id=menu_item)  # Get the actual object
        except MenuItem.DoesNotExist:
            return Response(
                {"error": "Menu item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Check if item already exists in cart
            cart_item, created = CartItem.objects.get_or_create(
                user=user,
                menu_item=menu_item,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response(
                {
                    "message": "Item added to cart successfully",
                    "cart_item_id": cart_item.id,
                    "quantity": cart_item.quantity
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},  
                status=status.HTTP_400_BAD_REQUEST
            )
        

    @action(detail=False, methods=['get'])
    def itemcount(self,request):
        user=request.user
        try : 
            result = CartItem.objects.filter(user=user).aggregate(total=Sum('quantity'))
            print(result)
            total = result.get('total',0) or 0
            print(total)
            return Response({"count":total},status=status.HTTP_200_OK)
        except Exception as e : 
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail= False, methods=['delete'])
    def clearcart(self, request):
        user = request.user 
        with transaction.atomic():
            try: 
                CartItem.objects.filter(user=user).delete() 
                return Response(
                    {"message": "Cart cleared successfully!"},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )



    @action(detail=False,methods=['post'])
    def checkout(self, request):
        user = request.user 
        all_items = CartItem.objects.filter(user=user)
        total_price = sum(item.total_price for item in user.cart_items.all())

        if all_items.count()<=0:
            return Response({"message":"Cart is Empty"},status=status.HTTP_200_OK)
        with transaction.atomic():
            try: 
                order = ActiveOrder.objects.create(
                    status = "Pending",
                    total_price = total_price,
                    ordered_by = user    
                )
                for item in all_items : 
                    OrderItem.objects.create(
                        order= order,
                        menu_item = item.menu_item,
                        quantity= item.quantity
                    )

                all_items.delete();   
                return Response({"order_id": order.id},status=status.HTTP_201_CREATED)
            

            except Exception as e : 
                return Response({"error": str(e)},status= status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    @action(detail=False, methods=['delete'])
    def deleteitem(self, request):
        user = request.user
        item_id = request.query_params.get('item_id')
        
        if not item_id:
            return Response(
                {"error": "item_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            item_id = int(item_id)
        except (ValueError, TypeError):
            return Response(
                {"error": "item_id must be a valid integer"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                deleted_count, _ = CartItem.objects.filter(
                    user=user, 
                    menu_item_id=item_id  # Use menu_item_id for direct ID filtering
                ).delete()
                
                if deleted_count == 0:
                    return Response(
                        {"error": "Item not found in cart"},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response(
                    {"message": "Item removed successfully"},
                    status=status.HTTP_200_OK
                )
    
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

    @action(detail=False,methods=['patch'])
    def updatequantity(self,request):
        item= request.data.get('item_id')
        action = request.data.get('action')
        item = CartItem.objects.get(user=request.user,menu_item=item)
        try: 
            if action =='increment':
                item.quantity +=1
            
            elif action =='decrement' and item.quantity>1:
                item.quantity-=1
        
            item.save()

            return Response(status=status.HTTP_200_OK)
        except Exception as e : 
            return Response({"error":str(e)})



    

class ActiveOrderViewSet(viewsets.ModelViewSet):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer
    permission_classes = [ IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]  # Use your custom class

    @action(detail= False,methods=['get'],)
    # def filterorders(self,request):
    #     user= request.user
    #     if user.role=='canteen_manager':
    #         try:
    #             orders = ActiveOrder.objects.all()
    #             serializer = self.get_serializer(orders,many=True)
    #             return Response(serializer.data,status=status.HTTP_200_OK)

    #         except Exception as e :
    #             return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    #     return Response({"error":"Not an authenticated user"},status=status.HTTP_403_FORBIDDEN)

        
    @action(detail= False,methods=['get','put'])
    def manageorder(self,request):
        user= request.user
        orderid = request.data.get('id')
        clicked_button = request.data.get('button_status')

        if user.role=='canteen_manager':
            try:
                order = ActiveOrder.objects.get(id=orderid)
                if clicked_button =='Accept':
                    order.status = 'Accepted'
                    order.save()
                
                elif clicked_button=='Reject':
                    order.status = 'Rejected'
                    order.save()

                serializer = self.get_serializer(order,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)

            except Exception as e :
                return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({"error":"Not an authenticated user"},status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        user = request.user
        if user.role=='canteen_manager':
            try:
                orders = ActiveOrder.objects.all()
                serializer = self.get_serializer(orders,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)

            except Exception as e :
                return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        elif user.role=='user': 
            try: 
                orders = ActiveOrder.objects.filter(ordered_by=user)
                serializer = self.get_serializer(orders, many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)

            except Exception as e :
                return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else : 
            return Response({"error":"Not an authenticated user"},status=status.HTTP_403_FORBIDDEN)
        
    @action(detail=False, methods=['get'])
    def getorder(self, request):
        user = request.user
        orderid = request.query_params.get('id')
        
        if not orderid:
            return Response({"error": "Order ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = ActiveOrder.objects.get(id=orderid)
            payment = Payment.objects.get(order=orderid)
            order_items = OrderItem.objects.filter(order=order)
            print(order_items)
            if user.role == 'canteen_manager':
                pass
            elif user.role == 'user':
                if order.ordered_by != user:
                    return Response({"error": "You are not authorized to view this order"}, 
                                status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "Unauthorized role"}, 
                            status=status.HTTP_403_FORBIDDEN)
            
            orderserializer = self.get_serializer(order)
            paymentserialzer = PaymentSerializer(payment)
            orderitemserializer = OrderItemSerializer(order_items,many=True)
            print(orderitemserializer.data)
            return Response({"order": orderserializer.data, "payment":paymentserialzer.data,"items":orderitemserializer.data}, status=status.HTTP_200_OK)
            
        except ActiveOrder.DoesNotExist:
            return Response({"error": "Order not found"}, 
                        status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        
class OrderItemHistoryViewset(viewsets.ModelViewSet):
    queryset = OrderItemHistory.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

class OrderHistoryViewset(viewsets.ModelViewSet):
    queryset = OrderHistory.objects.all()
    serializer_class = OrderHistorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    @action(detail=False, methods=['get'], authentication_classes=[CookieJWTAuthentication])
    def filter_order(self, request):
        user = request.user
        status_param = request.GET.get('status')

        if status_param:
            status_param = status_param.capitalize()
            valid_statuses = dict(ActiveOrder.STATUS_CHOICES).keys()
            if status_param not in valid_statuses:
                return Response(
                    {"error": f"Invalid status. Valid choices are: {', '.join(valid_statuses)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        orders = ActiveOrder.objects.filter(ordered_by=user)
        
        if status_param:
            orders = orders.filter(status=status_param)

        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentInitiateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    # Sandbox credentials
    MERCHANT_ID = "PGTESTPAYUAT"
    SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
    SALT_INDEX = 1
    BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"
    PHONEPE_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"
    FRONTEND_URL = "http://localhost:4200"
    BACKEND_URL = "http://localhost:8000"
    
    
    @action(detail=False, methods=['post'])
    def initiate(self, request):
        # Initialize serializer with request context
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # This will now work because create() is implemented in serializer
        payment = serializer.save(status='Pending')
        
        data = {
            "merchantId": self.MERCHANT_ID,
            "merchantTransactionId": payment.transaction_id,
            "merchantUserId": f"USER_{request.user.id}",
            "amount": int(payment.amount * 100),  # Convert to paise
            "redirectUrl": f"{self.FRONTEND_URL}/payment-callback",
            "redirectMode": "POST",
            "callbackUrl": f"{self.BACKEND_URL}/api/payments/{payment.id}/webhook/",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        
        try:
            # Generate checksum
            encoded_data = base64.b64encode(json.dumps(data).encode()).decode()
            string_to_hash = f"{encoded_data}/pg/v1/pay{self.SALT_KEY}"
            sha256_hash = hashlib.sha256(string_to_hash.encode()).hexdigest()
            checksum = f"{sha256_hash}###{self.SALT_INDEX}"
            
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "accept": "application/json"
            }
            
            response = requests.post(
                f"{self.BASE_URL}/pg/v1/pay",
                headers=headers,
                json={"request": encoded_data},
                timeout=10
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            if not response_data.get('success', False):
                payment.status = 'Failed'
                payment.save()
                return Response({
                    'success': False,
                    'error': response_data.get('message', 'Payment gateway error'),
                    'code': response_data.get('code', 'UNKNOWN_ERROR')
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Store the gateway response
            payment.gateway_response = response_data
            payment.save()
            
            return Response({
                'success': True,
                'payment_url': response_data['data']['instrumentResponse']['redirectInfo']['url'],
                'transaction_id': payment.transaction_id
            })
            
        except requests.exceptions.RequestException as e:
            payment.status = 'Failed'
            payment.save()
            return Response({
                'success': False,
                'error': f"Payment gateway connection error: {str(e)}"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        except Exception as e:
            payment.status = 'Failed'
            payment.save()
            return Response({
                'success': False,
                'error': f"Unexpected error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=True, methods=['post'])
    def webhook(self, request, pk=None):
        try:
            payment = self.get_queryset().get(pk=pk)
            x_verify = request.headers.get('X-VERIFY')
            
            # Verify the checksum
            response_data = request.data
            encoded_data = base64.b64encode(json.dumps(response_data).encode()).decode()
            expected_checksum = hashlib.sha256(
                f"{encoded_data}{self.SALT_KEY}"
            ).hexdigest() + f"###{self.SALT_INDEX}"
            
            if x_verify != expected_checksum:
                return Response({"status": "invalid signature"}, status=400)
            
            # Update payment status based on response
            code = response_data.get('code')
            if code == 'PAYMENT_SUCCESS':
                payment.status = 'Completed'
            elif code == 'PAYMENT_ERROR':
                payment.status = 'Failed'
            else:
                payment.status = 'Pending'
                
            payment.gateway_response = response_data
            payment.save()
            
            return Response({"status": "processed"})
            
        except Payment.DoesNotExist:
            return Response({"status": "payment not found"}, status=404)
        except Exception as e:
            return Response({"status": f"error: {str(e)}"}, status=500)

