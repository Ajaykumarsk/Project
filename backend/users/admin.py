from django.contrib import admin
from .models import CanteenFoodConsummationTiming, CanteenFoodOrderTiming, CanteenFoodRate, Caterer, Company, Department, EmployeeType, Location, Users

# Register your models here.
admin.site.register(Users)
admin.site.register(Department)
admin.site.register(Location)
admin.site.register(Company)
admin.site.register(EmployeeType)
admin.site.register(CanteenFoodConsummationTiming)
admin.site.register(CanteenFoodOrderTiming)
admin.site.register(Caterer)
admin.site.register(CanteenFoodRate)