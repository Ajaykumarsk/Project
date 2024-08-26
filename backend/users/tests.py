from datetime import date
from django.test import TestCase

from users.models import Department, Location, User

# Create your tests here.
class UserModelTestCase(TestCase):
    def setUp(self):
        # Create a Department
        self.department = Department.objects.create(name='Engineering')

        # Create a Location
        self.location = Location.objects.create(name='New York')

        # Create a User
        self.user = User.objects.create(
            name='John Doe',
            email='john@example.com',
            gender='Male',
            department=self.department,
            location=self.location,
            dateOfJoining=date.today()
        )

    def test_user_creation(self):
        """
        Test that a user was created correctly.
        """
        self.assertEqual(self.user.name, 'John Doe')
        self.assertEqual(self.user.email, 'john@example.com')
        self.assertEqual(self.user.gender, 'Male')
        self.assertEqual(self.user.department, self.department)
        self.assertEqual(self.user.location, self.location)
        self.assertEqual(self.user.dateOfJoining, date.today())

    def test_user_str_representation(self):
        """
        Test the string representation of a user.
        """
        self.assertEqual(str(self.user), 'John Doe')
        self.assertEqual(str(self.user.email), '123')