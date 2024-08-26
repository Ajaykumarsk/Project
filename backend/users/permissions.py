from rest_framework.permissions import BasePermission

class RoleBasedPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            user_role = request.user.role
            # Adjust the permission logic based on the view
            if user_role == 'admin':
                return True
            elif user_role == 'security':
                # Example: Allow access to all GET requests for security role
                return request.method in ['GET', 'POST','PUT']
            elif user_role == 'front_office':
                # Example: Allow POST requests for front_office role
                return request.method in ['GET', 'POST','PUT']
            elif user_role == 'approveadmin':
                # Example: Allow POST requests for front_office role
                return request.method in ['GET', 'POST','PUT']
            elif user_role == 'chairman':
                # Example: Allow POST requests for chairman role
                return request.method in ['GET', 'POST','PUT']
            return False
        return False
