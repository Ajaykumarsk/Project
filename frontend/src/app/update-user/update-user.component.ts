import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../app.service';
import { User } from '../User';
import { DatePipe } from '@angular/common';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';
import { CompanyService } from '../company.service';  // Assuming you have a service for companies
import { EmployeeTypeService } from '../employeetype.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  user: User | undefined;
  departments: any[] = [];
  locations: any[] = [];
  companies: any[] = [];  // Add this line
  employeeTypes: any[] = [];  // Add this line
  isLoggedIn: boolean = false;
  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];
  
  calendar: Date | null = null;

  form: FormGroup;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private departmentService: DepartmentService,
    private locationService: LocationService,
    private companyService: CompanyService,  // Inject the service for companies
    private employeeTypeService: EmployeeTypeService  // Inject the service for employee types
  ) {
    this.form = new FormGroup({
      employee_id: new FormControl('', [Validators.required]),
      device_enrol_number: new FormControl(''),
      card_number: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      email_id: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      department: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      company: new FormControl(''),
      employee_type: new FormControl(''),
      contact_number: new FormControl(''),
      date_of_joining: new FormControl(''),
      date_of_leaving: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadDepartments();
    this.loadLocations();
    this.loadCompanies();  // Add this line
    this.loadEmployeeTypes();  // Add this line
    const id = this.route.snapshot.params?.['id'];
    this.service.getUser(id).subscribe(
      (data) => {
        this.user = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch user:', error);
      }
    );
  }

  initializeForm(): void {
    if (!this.user) {
      return;
    }
    const departmentId = this.user.department?.toString() || '';
    const locationId = this.user.location?.toString() || '';
    const companyId = this.user.company?.toString() || '';
    const employeetypeId = this.user.employee_type?.toString() || '';
    
  
    const department = this.departments.find(dept => dept.id.toString() === departmentId);
    const location = this.locations.find(loc => loc.id.toString() === locationId);
    const company = this.companies.find(comp => comp.id.toString() === companyId);
    const employeeType = this.employeeTypes.find(type => type.id.toString() === employeetypeId);

    this.form.setValue({
      employee_id: this.user.employee_id || '',
      device_enrol_number: this.user.device_enrol_number || '',
      card_number: this.user.card_number || '',
      name: this.user.name || '',
      email_id: this.user.email_id || '',
      gender: this.user.gender || '', 
      department: department || null,
      location: location || null,
      company: company || null,
      employee_type: employeeType || null,
      contact_number: this.user.contact_number || '',
      date_of_joining: this.user.date_of_joining ? new Date(this.user.date_of_joining) : null,
      date_of_leaving: this.user.date_of_leaving ? new Date(this.user.date_of_leaving) : null,
    });

    const dateOfJoiningValue = this.form.get('date_of_joining')?.value;
    this.calendar = dateOfJoiningValue ? new Date(dateOfJoiningValue) : null;
    console.log(this.user);
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.service.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.user) {
      const formData = this.form.value;

      const updatedUser: User = {
        ...this.user,
        employee_id: formData.employee_id || '',
        device_enrol_number: formData.device_enrol_number || '',
        card_number: formData.card_number || '',
        name: formData.name || '',
        email_id: formData.email_id || '',
        gender: formData.gender || '',
        department: formData.department ? (formData.department as any).id : '',
        location: formData.location ? (formData.location as any).id : '',
        company: formData.company ? (formData.company as any).id : '',
        employee_type: formData.employee_type ? (formData.employee_type as any).id : '',
        contact_number: formData.contact_number || '',
        date_of_joining: this.datePipe.transform(formData.date_of_joining, 'yyyy-MM-dd') || '',
        date_of_leaving: this.datePipe.transform(formData.date_of_leaving, 'yyyy-MM-dd') || '',
      };

      this.service.updateUser(this.user.id, updatedUser).subscribe(
        (data) => {
          console.log('User updated successfully:', data);
          this.router.navigate(['/user']);
        },
        (error) => {
          console.error('Failed to update user:', error);
        }
      );
    } else {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.departments = departments.map((dept: any) => ({ id: dept.id, name: dept.name }));
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        this.locations = locations.map((loc: any) => ({ id: loc.id, name: loc.name }));
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  loadCompanies(): void {
    this.companyService.getcompanys().subscribe(
      (companies) => {
        this.companies = companies.map((comp: any) => ({ id: comp.id, name: comp.name }));
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  loadEmployeeTypes(): void {
    this.employeeTypeService.getEmployeeTypes().subscribe(
      (types) => {
        this.employeeTypes = types.map((type: any) => ({ id: type.id, name: type.name }));
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }
}
