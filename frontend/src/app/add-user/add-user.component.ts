import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';
import { User } from '../User';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../company.service';
import { EmployeeTypeService } from '../employeetype.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  name: string | null | undefined;
  isLoggedIn: boolean = false;
  departments: any[] = [];
  companies: any[] = [];
  employeeTypes: any[] = [];
  locations: any[] = [];
  genders: any[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];
  date: Date[] | undefined;

  // Constructor 
  constructor(
    private userService: UserService,
    private router: Router,
    private departmentService: DepartmentService,
    private locationService: LocationService,
    private datePipe: DatePipe,
    private companyService: CompanyService,
    private employeeTypeService: EmployeeTypeService,
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.loadDepartments();
    this.loadLocations();
    this.loadCompanies();
    this.loadEmployeeTypes();
  }

  //Function to Check Authentication 
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to access the dashboard.');
      this.router.navigate(['/login']);
    }
  }

  form = new FormGroup({
    employee_id: new FormControl('', Validators.required),
    device_enrol_number: new FormControl('', Validators.required),
    card_number: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email_id: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl(null, Validators.required),  // Use null as the initial value
    department: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    employee_type: new FormControl('', Validators.required),
    date_of_joining: new FormControl('', Validators.required),
    date_of_leaving: new FormControl('', Validators.required),
    contact_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')])
  });

  //Function To Add User Details from the Form on Submit  
  addUser(): void {
    // Log department and location values
    console.log('Selected department value:', this.form.value.department);
    console.log('Selected location value:', this.form.value.location);
  
    // Log departments and locations
    console.log('Departments:', this.departments);
    console.log('Locations:', this.locations);
  
    const formattedDateOfJoining = this.datePipe.transform(this.form.value.date_of_joining, 'yyyy-MM-dd');
    const formattedDateOfLeaving = this.datePipe.transform(this.form.value.date_of_leaving, 'yyyy-MM-dd');
  
    // Find the selected department object
    const selectedDepartment = this.departments.find(dept => dept === this.form.value.department);
    // Extract department ID or assign an empty string if not found
    const departmentId = selectedDepartment ? selectedDepartment.id : '';
  
    // Find the selected location object
    const selectedLocation = this.locations.find(loc => loc === this.form.value.location);
    // Extract location ID or assign an empty string if not found
    const locationId = selectedLocation ? selectedLocation.id : '';

    // Find the selected company object
    const selectedCompany = this.companies.find(companys => companys === this.form.value.company);
    // Extract company ID or assign an empty string if not found
    const companyId = selectedCompany ? selectedCompany.id : '';
  
    // Find the selected employee type object
    const selectedEmployeetype = this.employeeTypes.find(emptype => emptype === this.form.value.employee_type);
    // Extract employee type ID or assign an empty string if not found
    const employeeTypeId = selectedEmployeetype ? selectedEmployeetype.id : '';
  
    // Extract gender value or assign an empty string if not found
    const genderValue = this.form.value.gender ? (this.form.value.gender as { label: string, value: string }).value : '';

  
    const userData: User = {
      id: 0,
      employee_id: this.form.value.employee_id || '',
      device_enrol_number: this.form.value.device_enrol_number || '',
      card_number: this.form.value.card_number || '',
      name: this.form.value.name || '',
      email_id: this.form.value.email_id || '',
      gender: genderValue,
      date_of_joining: formattedDateOfJoining || '',
      date_of_leaving: formattedDateOfLeaving || '',
      department: departmentId.toString(),
      location: locationId.toString(),
      company: companyId.toString(),
      employee_type: employeeTypeId.toString(),
      contact_number: this.form.value.contact_number || '',
      departmentName: selectedDepartment ? selectedDepartment.name : '',
      locationName: selectedLocation ? selectedLocation.name : '',
      companyName: selectedCompany ? selectedCompany.name : '',
      employeeTypeName: selectedEmployeetype ? selectedEmployeetype.name : ''
    };
  
    console.log('Selected department:', selectedDepartment);
    console.log('Selected location:', selectedLocation);
    console.log('User data:', userData);
    
    this.userService.addUser(userData).subscribe(
      (data) => {
        this.router.navigate(['/user']);
        console.log(userData);
      },
      (error) => {
        console.error('Error adding user:', error);
        console.log(userData);
        // Handle error (e.g., display error message)
      }
    );
  }
  
  //Function to Load Department Details
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.departments = departments;
        console.log('Departments:', this.departments);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  
  //Function to Load Location Details
  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        this.locations = locations;
        console.log('Locations:', this.locations);
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
  
  // Function to load company details
  loadCompanies(): void {
    this.companyService.getcompanys().subscribe(
      (companies) => {
        this.companies = companies;
        console.log('Companies:', this.companies);
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  // Function to load employee type details
  loadEmployeeTypes(): void {
    this.employeeTypeService.getEmployeeTypes().subscribe(
      (employeeTypes) => {
        this.employeeTypes = employeeTypes;
        console.log('Employee Types:', this.employeeTypes);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }
}
