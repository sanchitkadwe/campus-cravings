from django.urls import path,include 
from rest_framework import routers 
from .views import  UserViewSet, CategoryViewSet, MenuItemViewSet, CartItemViewSet, ActiveOrderViewSet, PaymentViewSet,StoreViewSet,OrderHistoryViewset,OrderItemHistoryViewset
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'cart', CartItemViewSet)
router.register(r'orders', ActiveOrderViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'store',StoreViewSet)
router.register(r'orderhistory',OrderHistoryViewset)
router.register(r'orderitemhistory',OrderItemHistoryViewset)

path = urlpatterns = [
    path('app/', include(router.urls) )
]
