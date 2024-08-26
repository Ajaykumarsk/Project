import io
from django.forms import ValidationError
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from django.db.models import Q
from users.filter import DynamicLookupFilter
from users.pagination import CustomPagination
import xlsxwriter

from users.permissions import RoleBasedPermission
from .models import CanteenFoodConsummationTiming, CanteenFoodMenu, CanteenFoodOrderTiming, CanteenFoodRate, Caterer, CatererMenu, Circular, CircularMenu, Company, Department, EmployeeType, Location, User, Users, Visitor
from .serializer import CanteenFoodConsummationTimingSerializer, CanteenFoodMenuSerializer, CanteenFoodOrderTimingSerializer, CanteenFoodRateSerializer, CatererMenuSerializer, CatererSerializer, CircularMenuSerializer, CircularSerializer, CompanySerializer, CustomTokenObtainPairSerializer, CustomUserSerializer, DepartmentSerializer, EmployeeTypeSerializer, LocationSerializer, UserSerializer, VisitorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics
from .models import User
from .pagination import CustomPagination


class UserAll(generics.ListCreateAPIView):
   
    queryset = Users.objects.all().order_by('id')
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DynamicLookupFilter
    filterset_fields = ['id', 'name', 'email', 'gender', 'department', 'location', 'dateOfJoining']
    pagination_class = CustomPagination
    

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            try:
                search_terms = [term.split(':') for term in search_query.split(',')]
            except ValueError:
                raise ValidationError('Invalid search query format. Expected format is key1:value1,key2:value2,...')
            
            q_objects = Q()
            for key, value in search_terms:
                q_objects |= self.get_query_object(key, value)
            queryset = queryset.filter(q_objects)
        return queryset

    def get_query_object(self, key, value):
        if key =='id':
            return Q(id__istartswith=value) 
        if key == 'name':
            return Q(name__istartswith=value)
        elif key == 'email':
            return Q(email__istartswith=value)
        elif key == 'gender':
            return Q(gender__istartswith=value)
        elif key == 'department':
            return Q(department__name__istartswith=value)
        elif key == 'location':
            return Q(location__istartswith=value)
        elif key == 'dateOfJoining':
            return Q(dateOfJoining__istartswith=value)
        else:
            raise ValidationError(f'Invalid search field: {key}')
    
def download_users_excel(request):
    
   # Fetch all users from the database
    users = Users.objects.all().order_by('id')

  # Create a new Excel workbook and add a worksheet
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()

    # Define cell formats
    header_format = workbook.add_format({'bold': True, 'border': 1, 'bg_color': '#cccccc'})
    data_format = workbook.add_format({'border': 1})

    # Write headers to the worksheet
    headers = ['ID', 'Name', 'Email', 'Gender', 'Department', 'Location', 'Date of Joining']
    for col, header in enumerate(headers):
        worksheet.write(0, col, header, header_format)

    # Write data to the worksheet
    for row, user in enumerate(users, start=1):
        worksheet.write(row, 0, user.id, data_format)
        worksheet.write(row, 1, user.name, data_format)
        worksheet.write(row, 2, user.email, data_format)
        worksheet.write(row, 3, user.gender, data_format)
        worksheet.write(row, 4, user.department, data_format)
        worksheet.write(row, 5, user.location, data_format)
        worksheet.write(row, 6, user.dateOfJoining.strftime('%d-%m-%Y'), data_format)

    # Set column widths
    worksheet.set_column('A:A', 10)  # ID
    worksheet.set_column('B:B', 20)  # Name
    worksheet.set_column('C:C', 30)  # Email
    worksheet.set_column('D:D', 10)  # Gender
    worksheet.set_column('E:E', 20)  # Department
    worksheet.set_column('F:F', 20)  # Location
    worksheet.set_column('G:G', 15)  # Date of Joining

    # Close the workbook
    workbook.close()

    # Set response headers
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=users.xlsx'

    # Write workbook content to the response
    output.seek(0)
    response.write(output.read())
  
    return response

class RestrictedView(APIView):
    permission_classes = [RoleBasedPermission,IsAuthenticated]

    def get(self, request, format=None):
        return Response({"response": "YOU ARE ALLOWED"})
        
#To fetch user Details
class UserList(generics.ListCreateAPIView):
    
    queryset = Users.objects.all().order_by('id')
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = DynamicLookupFilter
    search_fields = ['id', 'name', 'email', 'gender', 'department', 'location', 'dateOfJoining']

    
 
    
class VisitorListCreateView(generics.ListCreateAPIView):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [RoleBasedPermission,IsAuthenticated]
    

class VisitorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [RoleBasedPermission,IsAuthenticated]

class VisitorSearchAPIView(generics.GenericAPIView):
    serializer_class = VisitorSerializer

    def get(self, request, *args, **kwargs):
        search_value = request.query_params.get('search')
        try:
            visitor = Visitor.objects.get(Q(mobile_no=search_value) | Q(badge_id=search_value))
            serializer = self.get_serializer(visitor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Visitor.DoesNotExist:
            return Response({'error': 'Visitor not found'}, status=status.HTTP_404_NOT_FOUND)
        
    permission_classes = [RoleBasedPermission,IsAuthenticated]
 #To Update user Details    
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [RoleBasedPermission,IsAuthenticated]
    queryset = Users.objects.all().order_by('id')
    serializer_class = UserSerializer

#To fetch Department Details
class DepartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    permission_classes = [RoleBasedPermission]

#To update Deparment Details
class DepartmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    permission_classes = [RoleBasedPermission]

#To fetch Location Details
class LocationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Location.objects.all().order_by('id')
    serializer_class = LocationSerializer
    permission_classes = [RoleBasedPermission]

#To Update Location Details
class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all().order_by('id')
    serializer_class = LocationSerializer
    permission_classes = [RoleBasedPermission]

#To fetch Company Details
class CompanyListCreateAPIView(generics.ListCreateAPIView):
    queryset = Company.objects.all().order_by('id')
    serializer_class = CompanySerializer
    permission_classes = [RoleBasedPermission]

#To update Company Details
class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all().order_by('id')
    serializer_class = CompanySerializer
    permission_classes = [RoleBasedPermission]


class EmployeeTypeListCreateAPIView(generics.ListCreateAPIView):
    queryset = EmployeeType.objects.all().order_by('id')
    serializer_class = EmployeeTypeSerializer
    permission_classes = [RoleBasedPermission]

class EmployeeTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployeeType.objects.all().order_by('id')
    serializer_class = EmployeeTypeSerializer
    permission_classes = [RoleBasedPermission]

class CanteenFoodConsummationTimingListCreateAPIView(generics.ListCreateAPIView):
    queryset = CanteenFoodConsummationTiming.objects.all()
    serializer_class = CanteenFoodConsummationTimingSerializer
    permission_classes = [RoleBasedPermission]

class CanteenFoodConsummationTimingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CanteenFoodConsummationTiming.objects.all()
    serializer_class = CanteenFoodConsummationTimingSerializer
    permission_classes = [RoleBasedPermission]


class CanteenFoodOrderTimingListCreateAPIView(generics.ListCreateAPIView):
    queryset = CanteenFoodOrderTiming.objects.all()
    serializer_class = CanteenFoodOrderTimingSerializer
    permission_classes = [RoleBasedPermission]

class CanteenFoodOrderTimingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CanteenFoodOrderTiming.objects.all()
    serializer_class = CanteenFoodOrderTimingSerializer
    permission_classes = [RoleBasedPermission]

class CatererListCreateAPIView(generics.ListCreateAPIView):
    queryset = Caterer.objects.all()
    serializer_class = CatererSerializer

class CatererRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Caterer.objects.all()
    serializer_class = CatererSerializer

class CanteenFoodRateListCreateView(generics.ListCreateAPIView):
    queryset = CanteenFoodRate.objects.all()
    serializer_class = CanteenFoodRateSerializer

class CanteenFoodRateRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CanteenFoodRate.objects.all()
    serializer_class = CanteenFoodRateSerializer


class CanteenFoodMenuListCreateView(generics.ListCreateAPIView):
    queryset = CanteenFoodMenu.objects.all()
    serializer_class = CanteenFoodMenuSerializer

class CanteenFoodMenuRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CanteenFoodMenu.objects.all()
    serializer_class = CanteenFoodMenuSerializer
        
class CatererMenuListCreateView(generics.ListCreateAPIView):
    queryset = CatererMenu.objects.all()
    serializer_class = CatererMenuSerializer

class CatererMenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CatererMenu.objects.all()
    serializer_class = CatererMenuSerializer

class CircularListCreateView(generics.ListCreateAPIView):
    queryset = Circular.objects.all().order_by('-created')
    serializer_class = CircularSerializer

class CircularDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Circular.objects.all().order_by('-created')
    serializer_class = CircularSerializer


class CircularMenuListCreateView(generics.ListCreateAPIView):
    queryset = CircularMenu.objects.all().order_by('-valid_from')
    serializer_class = CircularMenuSerializer

class CircularMenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CircularMenu.objects.all().order_by('-valid_from')
    serializer_class = CircularMenuSerializer

from rest_framework.decorators import api_view
@api_view(['POST'])
def get_canteen_food_menus_by_ids(request):
    # Get the list of IDs from the request data
    ids = request.data.get('ids', [])
    
    if not ids:
        return JsonResponse({"error": "No IDs provided"}, status=400)

    # Query the database for all food menus with the provided IDs
    menus = CanteenFoodMenu.objects.filter(id__in=ids)
    
    # Serialize the data
    serializer = CanteenFoodMenuSerializer(menus, many=True)
    
    # Return the serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)

from rest_framework import viewsets
class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer

    def get_new_visitor_count(self, request):
        count = Visitor.objects.filter(is_verified=False).count()
        return Response({'count': count})

    def get_approved_visitor_count(self, request):
        count = Visitor.objects.filter(is_approved=True).count()
        return Response({'count': count})

    def get_recent_visitors(self, request):
        recent_visitors = Visitor.objects.filter(is_verified=False)
        serializer = VisitorSerializer(recent_visitors, many=True)
        return Response(serializer.data)
    
def helloWorld(HttpRequest):
    return HttpResponse("Hello World")
class LoginView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            user = authenticate(username=username, password=password)
            if user is None:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role
            })
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#To Register the User 
class RegisterView(APIView):
    def post(self, request):
        # Retrieve data from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # Check if all required fields are provided
        if not username or not email or not password or not confirm_password:
            return JsonResponse({'error': 'Username, email, password, and confirm password are required'}, status=400)

        # Check if passwords match
        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        # Create user
        try:
            User = get_user_model()
            user = User.objects.create_user(username=username, email=email, password=password)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
from rest_framework_simplejwt.tokens import OutstandingToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist current access token
            token = OutstandingToken.objects.get(user=request.user)
            token.blacklist()

            # Optionally, blacklist refresh tokens if needed
            refresh_tokens = OutstandingToken.objects.filter(user=request.user, token_type=OutstandingToken.REFRESH)
            for refresh_token in refresh_tokens:
                refresh_token.blacklist()

            return Response({'success': 'Logged out successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

from django.http import HttpResponse
from io import BytesIO
import pandas as pd
import requests
from PIL import Image
from .models import Visitor
from datetime import datetime, timedelta
import tempfile
import pytz

def export_visitors(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    
    if not start_date_str or not end_date_str:
        return HttpResponse("Please provide start_date and end_date query parameters", status=400)
    
    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)  # Include end of end_date
    except ValueError:
        return HttpResponse("Invalid date format. Please use YYYY-MM-DD", status=400)
    
    if start_date > end_date:
        return HttpResponse("start_date cannot be greater than end_date", status=400)
    
    visitors = Visitor.objects.filter(valid_pass_from__gte=start_date, valid_pass_to__lte=end_date)
    def format_duration(duration):
        hours, remainder = divmod(duration.total_seconds(), 3600)
        minutes, _ = divmod(remainder, 60)
        return f"{int(hours)} hours {int(minutes)} minutes"
    data = []
    for visitor in visitors:
        # Parse and format datetime strings with timezone information
        check_in_time = visitor.check_in_time.astimezone(pytz.timezone('Asia/Kolkata')).strftime("%Y-%m-%d %I:%M:%S %p") if visitor.check_in_time else 'Not Checked In'
        check_out_time = visitor.check_out_time.astimezone(pytz.timezone('Asia/Kolkata')).strftime("%Y-%m-%d %I:%M:%S %p") if visitor.check_out_time else 'Not Checked Out'

          # Calculate total stayed hours
        if visitor.check_in_time and visitor.check_out_time:
            stayed_duration = visitor.check_out_time - visitor.check_in_time
            total_stayed_time = format_duration(stayed_duration)
        else:
            total_stayed_time = 'No Data'

        data.append({
            'Visitor Pass No': visitor.visitor_pass_no or 'No Data',
            'Name': visitor.visitor_name or 'No Data',
            'Mobile No': visitor.mobile_no or 'No Data',
            'Email': visitor.email or 'No Data',
            'Visitor Photo': 'Photo Present' if visitor.visitor_photo else 'No Photo',
            'ID Proof Photo': 'Photo Present' if visitor.id_proof_photo else 'No Photo',
            'Designation': visitor.designation or 'No Data',
            'Department': visitor.department or 'No Data',
            'Nationality': visitor.nationality or 'No Data',
            'Total Visitors': visitor.total_visitor or 'No Data',
            'Company Name': visitor.company_name or 'No Data',
            'Company Contact No': visitor.company_contact_no or 'No Data',
            'Company Address': visitor.company_address or 'No Data',
            'Area to Visit': visitor.area_to_visit or 'No Data',
            'Type of Visitor': visitor.type_of_visitor or 'No Data',
            'Meeting Purpose': visitor.meeting_purpose or 'No Data',
            'ID Proof': visitor.id_proof or 'No Data',
            'ID Proof Number': visitor.id_proof_number or 'No Data',
            'Valid Pass From': visitor.valid_pass_from.strftime("%Y-%m-%d") if visitor.valid_pass_from else 'No Data',
            'Valid Pass To': visitor.valid_pass_to.strftime("%Y-%m-%d") if visitor.valid_pass_to else 'No Data',
            'Visitor Status': visitor.visitor_status or 'No Data',
            'Expecting Stay Hours': visitor.expecting_stay_hours or 'No Data',
            'Select Employee': visitor.select_employee or 'No Data',
            'Host Department': visitor.host_department or 'No Data',
            'Host Email ID': visitor.host_email_id or 'No Data',
            'Host Contact Details': visitor.host_contact_details or 'No Data',
            'Item Caring': visitor.item_caring or 'No Data',
            'Make Serial No': visitor.make_serial_no or 'No Data',
            'Vehicle Number': visitor.vehicle_number or 'No Data',
            'Vehicle Type': visitor.vehicle_type or 'No Data',
            'Check-In Time': check_in_time,
            'Check-Out Time': check_out_time,
            'Total Stayed Time': total_stayed_time,
            'Verified': 'Yes' if visitor.is_verified else 'No',
            'Approved': 'Yes' if visitor.is_approved else 'No',
        })
    
    df = pd.DataFrame(data)
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Visitors')

        workbook = writer.book
        worksheet = writer.sheets['Visitors']
        format_center = workbook.add_format({'align': 'center', 'valign': 'vcenter', 'text_wrap': True})
        for col_num, value in enumerate(df.columns.values):
            worksheet.write(0, col_num, value, format_center)
            worksheet.set_column(col_num, col_num, 20, format_center)
        
      
       # Adding images to the excel file
        row = 1
        for visitor in visitors:
            if visitor.visitor_photo:
                visitor_photo_url = request.build_absolute_uri(visitor.visitor_photo.url)
                try:
                    photo_response = requests.get(visitor_photo_url, timeout=10)  # Adjust timeout as needed
                    if photo_response.status_code == 200:
                        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmpfile:
                            tmpfile.write(photo_response.content)
                            img = Image.open(tmpfile.name)
                            img_width, img_height = img.size
                            # Calculate scale to fit within cell
                            x_scale = 1.0 * (120 / img_width)  # Adjust scaling factor as needed
                            y_scale = 0.8 * (120 / img_height)  # Adjust scaling factor as needed
                            # Insert image with alignment
                            worksheet.insert_image(row, df.columns.get_loc('Visitor Photo'), tmpfile.name, {'x_scale': x_scale, 'y_scale': y_scale, 'align': 'center', 'valign': 'vcenter'})
                            # Adjust row height based on image height
                            worksheet.set_row(row, img_height / 6)  # 6 is an approximate conversion factor to points
                except (requests.RequestException, IOError) as e:
                    print(f"Error fetching visitor photo for {visitor.visitor_name}: {str(e)}")
            
            if visitor.id_proof_photo:
                id_proof_photo_url = request.build_absolute_uri(visitor.id_proof_photo.url)
                try:
                    id_photo_response = requests.get(id_proof_photo_url, timeout=10)  # Adjust timeout as needed
                    if id_photo_response.status_code == 200:
                        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmpfile:
                            tmpfile.write(id_photo_response.content)
                            img = Image.open(tmpfile.name)
                            img_width, img_height = img.size
                            # Calculate scale to fit within cell
                            x_scale = 1.0 * (120 / img_width)  # Adjust scaling factor as needed
                            y_scale = 0.8 * (120 / img_height)  # Adjust scaling factor as needed
                            # Insert image with alignment
                            worksheet.insert_image(row, df.columns.get_loc('ID Proof Photo'), tmpfile.name, {'x_scale': x_scale, 'y_scale': y_scale, 'align': 'center', 'valign': 'vcenter'})
                            # Adjust row height based on image height
                            worksheet.set_row(row, img_height / 6)  # 6 is an approximate conversion factor to points
                except (requests.RequestException, IOError) as e:
                    print(f"Error fetching ID proof photo for {visitor.visitor_name}: {str(e)}")
            
            row += 1

    output.seek(0)
    response = HttpResponse(output.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=visitors.xlsx'
    
    return response



class NextVisitorPassView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Get the last visitor pass number from the database
            last_visitor = Visitor.objects.latest('visitor_pass_no')
            current_pass_no = int(last_visitor.visitor_pass_no) + 1
        except Visitor.DoesNotExist:
            current_pass_no = 1  # If no visitor exists yet

        return Response({'nextPassNo': str(current_pass_no)}, status=status.HTTP_200_OK)
    
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        role = getattr(user, 'role', 'unknown')  # Adjust based on your user model
        return Response({'role': role})
   