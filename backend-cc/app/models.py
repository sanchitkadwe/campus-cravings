from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Store(models.Model):
    is_open = models.BooleanField(default=False)


    def __str__(self):
        return "Open" if self.is_open else "Closed"

class User(AbstractUser):

    # email = None
    first_name = None
    last_name = None 
    # username = None

    ROLE_CHOICES = [
        ('user', 'User'),
        ('canteen_manager', 'Canteen Manager'),
        ('super_admin', 'Super Admin'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    name= models.CharField(max_length=20,default="user",blank=False,null=False)
    hostel=models.IntegerField(default=1)
    phone_number= models.CharField(max_length=15,unique=True,default="123")
    password = models.CharField(max_length=100,blank=False,null= False,unique= True)
    

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["name","role","username"]  


    def is_admin(self):
        return self.role=='canteen_manager'
    
    def is_user(self):
        return self.role=='user'
   
    def __str__(self):
        return self.name
    
    

class Category(models.Model):
    category_name = models.CharField(max_length= 20, unique=True)

    def __str__(self):
        return self.category_name 

class MenuItem(models.Model):
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    item_name = models.CharField(max_length= 30)
    price = models.PositiveIntegerField()
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='item_image/',blank=True,null=True)

    def __str__(self):
        return self.item_name

class CartItem(models.Model):
    user = models.ForeignKey(User,default= 1, on_delete=models.CASCADE,related_name="cart_items")
    menu_item = models.ForeignKey('MenuItem', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def total_price(self):
        return self.menu_item.price * self.quantity
    
    def __str__(self):
        return f"{self.quantity} X {self.menu_item}"


class ActiveOrder(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),  # Order placed, but payment pending
        ('Accepted', 'Accepted'),  # Payment successful, order confirmed
        ('Cancelled', 'Cancelled'),  # Order cancelled
        ('Delivered', 'Delivered'),  # Order cancelled
        ('Rejected','Rejected')

    ]
    ordered_by = models.ForeignKey(User, default=1,on_delete= models.CASCADE)
    status = models.CharField(max_length=10,choices=STATUS_CHOICES, default='Pending')
    total_price = models.PositiveIntegerField()
    order_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.ordered_by.name} [{self.status}]"

class OrderItem(models.Model):
    order = models.ForeignKey(ActiveOrder, on_delete=models.CASCADE, related_name='order_items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Order Item: {self.order}"
    

class OrderItemHistory(models.Model):
    order= models.ForeignKey(ActiveOrder,on_delete= models.CASCADE,related_name= 'orderitems_history')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"History of Item : {self.menu_item.item_name} for Order No : {self.order}"

class OrderHistory(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),  # Order placed, but payment pending
        ('Accepted', 'Accepted'),  # Payment successful, order confirmed
        ('Cancelled', 'Cancelled'),  # Order cancelled
        ('Delivered', 'Delivered'),  # Order cancelled
        ('Rejected','Rejected')

    ]
    ordered_by = models.ForeignKey(User, on_delete= models.CASCADE)
    status = models.CharField(max_length=10,choices=STATUS_CHOICES, default='Pending')
    total_price = models.PositiveIntegerField()
    order_time = models.DateTimeField()
    last_updated = models.DateTimeField()

    def __str__(self):
        return f"Order #{self.id} - {self.ordered_by.name} [{self.status}]"

    
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    order = models.OneToOneField(ActiveOrder,on_delete=models.CASCADE,related_name='payment')
    status= models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    payment_time = models.DateTimeField(auto_now_add=True)
    transaction_id = models.CharField(max_length=50,unique=True,blank=True, null=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} : {self.status}"
    



class DummyPayment(models.Model):   
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    gateway_response = models.JSONField(null=True, blank=True)