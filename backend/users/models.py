from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ValidationError
#Department Model
class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#Location Model
class Location(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#company  Model
class Company(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
#Employee type  Model
class EmployeeType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#User Model
class Users(models.Model):
    employee_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    device_enrol_number = models.CharField(max_length=50, unique=True)
    card_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    employee_type = models.ForeignKey(EmployeeType, on_delete=models.SET_NULL, blank=True, null=True)
    gender = models.CharField(max_length=10)
    email_id = models.EmailField(max_length=255, unique=True)
    contact_number = models.CharField(max_length=15, unique=True)
    date_of_joining = models.DateField()
    date_of_leaving = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.employee_id

class Visitor(models.Model):
    visitor_pass_no = models.AutoField(primary_key=True)
    badge_id = models.CharField(max_length=50, null=True)
    visitor_name = models.CharField(max_length=100)
    mobile_no = models.CharField(max_length=15,unique=True)
    email = models.EmailField(null=True,unique=True)
    designation = models.CharField(max_length=100, null=True)
    department = models.CharField(max_length=100, null=True)
    nationality = models.CharField(max_length=50, null=True)
    total_visitor = models.IntegerField(null=True)
    company_name = models.CharField(max_length=100)
    company_contact_no = models.CharField(max_length=15, null=True)
    company_address = models.TextField(null=True)
    area_to_visit = models.CharField(max_length=100)
    type_of_visitor = models.CharField(max_length=100)
    meeting_purpose = models.CharField(max_length=100)
    id_proof = models.CharField(max_length=100, null=True)
    id_proof_number = models.CharField(max_length=100, null=True,unique=True)
    valid_pass_from = models.DateField()
    valid_pass_to = models.DateField()
    visitor_status = models.CharField(max_length=20)
    expecting_stay_hours = models.CharField(max_length=20, null=True)
    select_employee = models.CharField(max_length=100, null=True) #Fk
    host_department = models.CharField(max_length=100, null=True)
    host_email_id = models.EmailField(null=True)
    host_contact_details = models.CharField(max_length=15, null=True)
    item_caring = models.CharField(max_length=100, null=True)
    make_serial_no = models.CharField(max_length=100, null=True)
    vehicle_number = models.CharField(max_length=100, null=True)
    vehicle_type = models.CharField(max_length=100, null=True)

    visitor_photo = models.ImageField(upload_to='visitor_photos/', null=True)
    id_proof_photo = models.ImageField(upload_to='id_proof_photos/', null=True)
   # New fields for check-in, check-out, verify, and approval
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    
    

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('security', 'Security'),
        ('front_office', 'Front Office'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username
    

class CanteenFoodConsummationTiming(models.Model):
    name = models.CharField(max_length=100)
    begin_time = models.TimeField()  
    end_time = models.TimeField()   


    def __str__(self) -> str:
        return self.name
    
class CanteenFoodOrderTiming(models.Model):
    name = models.CharField(max_length=100)
    begin_time = models.TimeField()  
    end_time = models.TimeField()    


    def __str__(self) -> str:
        return self.name


class Caterer(models.Model):
    caterer_name = models.CharField(max_length=50)
    canteen_item_name = models.CharField(max_length=50)
    valid_from = models.DateField()
    valid_to = models.DateField()

    def __str__(self) -> str:
        return self.caterer_name
    
class CanteenFoodRate(models.Model):
    caterer_name = models.ForeignKey(Caterer, on_delete=models.CASCADE)
    canteen_item_name = models.CharField(max_length=50)
    valid_from = models.DateField()
    valid_to = models.DateField()
    employer_contribution = models.FloatField()
    employee_contribution = models.FloatField()
    caterer_price = models.FloatField()
    employee_type = models.ForeignKey(EmployeeType, on_delete=models.CASCADE) 

    def __str__(self) -> str:
        return f"{self.caterer.caterer_name} - {self.canteen_item_name} - {self.employee_type.name}"

class CanteenFoodMenu(models.Model):
    name = models.CharField(max_length=50)
    menu = models.CharField(max_length=50)
    quantity = models.CharField(max_length=50)
    calorie = models.IntegerField()
    item_photo = models.ImageField(upload_to='item_photos/', null=True)

    def __str__(self) -> str:
        return f"{self.name} - {self.menu}"

class CatererMenu(models.Model):
    caterer_name = models.ForeignKey(Caterer, on_delete=models.CASCADE)
    food_menu = models.ManyToManyField(CanteenFoodMenu)
    valid_from = models.DateField()

    def __str__(self) -> str:
        return f"{self.caterer_name} - {self.food_menu.menu}"



def validate_file_type(value):
    if not value.name.endswith(('.jpg', '.jpeg', '.png', '.mp4', '.mov')):
        raise ValidationError("File type is not supported. Please upload an image or video.")

class Circular(models.Model):
    title = models.CharField(max_length=255)
    media = models.FileField(upload_to='circularmedia/', validators=[validate_file_type])
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class CircularMenu(models.Model):
    circular = models.ManyToManyField(Circular)
    valid_from = models.DateField()

    def __str__(self):
       return f"{self.circular}"