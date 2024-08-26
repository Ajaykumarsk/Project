from rest_framework import serializers
from .models import CanteenFoodConsummationTiming, CanteenFoodMenu, CanteenFoodOrderTiming, CanteenFoodRate, Caterer, CatererMenu, Circular, CircularMenu, Company, Department, EmployeeType, Location, User, Users, Visitor
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

#Department ->id,name
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']
# Location -> id,name
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class EmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeType
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    departmentName = serializers.CharField(source='department.name', read_only=True)
    locationName = serializers.CharField(source='location.name', read_only=True)
    companyName = serializers.CharField(source='company.name', read_only=True)
    employeeTypeName = serializers.CharField(source='employee_type.name', read_only=True)

    class Meta:
        model = Users
        fields = ('id', 'employee_id', 'name','device_enrol_number', 'card_number', 'company', 'location', 'department', 'employee_type', 'gender', 'email_id', 'contact_number', 'date_of_joining', 'date_of_leaving', 'departmentName', 'locationName', 'companyName', 'employeeTypeName')

#For User Registration -> username,email,password,confirm password
class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class VisitorSerializer(serializers.ModelSerializer):
    visitor_photo = serializers.ImageField(required=False)
    id_proof_photo = serializers.ImageField(required=False)

    class Meta:
        model = Visitor
        fields = '__all__'

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'role']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        return token

# serializers.py

from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class CanteenFoodConsummationTimingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanteenFoodConsummationTiming
        fields = ['id', 'name', 'begin_time', 'end_time']

class CanteenFoodOrderTimingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanteenFoodOrderTiming
        fields = ['id', 'name', 'begin_time', 'end_time']

class CatererSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caterer
        fields = ['id','caterer_name','canteen_item_name','valid_from','valid_to']

class CanteenFoodRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanteenFoodRate
        fields = ['id','caterer_name','canteen_item_name','valid_from','valid_to','employer_contribution','employee_contribution','caterer_price','employee_type']

class CanteenFoodMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanteenFoodMenu
        fields = ['id','name','menu','quantity','calorie','item_photo']


class CatererMenuSerializer(serializers.ModelSerializer):
    food_menu_details = CanteenFoodMenuSerializer(source='food_menu', many=True, read_only=True)
    caterer_name = serializers.PrimaryKeyRelatedField(queryset=Caterer.objects.all())
    food_menu = serializers.PrimaryKeyRelatedField(queryset=CanteenFoodMenu.objects.all(), many=True)
    valid_from = serializers.DateField()

    class Meta:
        model = CatererMenu
        fields = ['id', 'caterer_name', 'food_menu', 'food_menu_details', 'valid_from']

    def create(self, validated_data):
        food_menus = validated_data.pop('food_menu')
        caterer_menu = CatererMenu.objects.create(**validated_data)
        caterer_menu.food_menu.set(food_menus)
        return caterer_menu
    
class CircularSerializer(serializers.ModelSerializer):
    class Meta:
        model = Circular
        fields = ['id', 'title', 'media', 'created', 'updated']

class CircularMenuSerializer(serializers.ModelSerializer):
    circular_menu_details = CircularSerializer(source='circulars', many=True, read_only=True)
    circulars = serializers.PrimaryKeyRelatedField(queryset=Circular.objects.all(), many=True)
    valid_from = serializers.DateField()

    class Meta:
        model = CircularMenu
        fields = ['id', 'circulars', 'circular_menu_details', 'valid_from']

    def create(self, validated_data):
        circulars = validated_data.pop('circulars')
        circular_menu = CircularMenu.objects.create(**validated_data)
        circular_menu.circulars.set(circulars)
        return circular_menu
