from django.contrib import admin
from .models import User,MenuItem,Category,CartItem,ActiveOrder,Payment,Store,OrderHistory,OrderItem,OrderItemHistory
# Register your models here.

admin.site.register(User)
admin.site.register(MenuItem)
admin.site.register(Category)
admin.site.register(CartItem)
admin.site.register(ActiveOrder)
admin.site.register(Payment)
admin.site.register(Store)
admin.site.register(OrderHistory)
admin.site.register(OrderItem)
admin.site.register(OrderItemHistory)


