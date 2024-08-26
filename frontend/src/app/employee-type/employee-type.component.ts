import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeTypeService } from '../employeetype.service';

@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html', // Updated template URL
  styleUrls: ['./employee-type.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EmployeeTypeComponent implements OnInit { // Updated class name to EmployeeTypeComponent
  employeeTypeForm!: FormGroup; // Updated form name
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  employeeTypes: any[] = []; // Updated variable name
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeTypeService: EmployeeTypeService, // Updated service name
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchEmployeeTypes(); // Updated method call
  }

  initializeForm(): void {
    this.employeeTypeForm = this.fb.group({ // Updated form name
      employeeTypeName: ['', Validators.required] // Updated form field name
    });
  }

  // To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage employee types.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.employeeTypeForm.reset(); // Reset form when dialog is closed
  }

  // Function To add Employee Type
  addEmployeeType(): void { // Updated method name
    if (this.employeeTypeForm.valid) { // Updated form name
      const employeeTypeName = this.employeeTypeForm.value.employeeTypeName; // Updated form field name
      this.employeeTypeService.addEmployeeType({ // Updated service method call
        name: employeeTypeName,
        id: 0
      }).subscribe(
        () => {
          console.log('Employee type added successfully');
          this.fetchEmployeeTypes(); // Refresh employee types list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          console.error('Failed to add employee type:', error);
          alert('Failed to add employee type. Please try again.');
        }
      );
    }
  }

  // Function to fetch Employee Type Details
  fetchEmployeeTypes(): void { // Updated method name
    this.employeeTypeService.getEmployeeTypes().subscribe( // Updated service method call
      (data: any[]) => {
        this.employeeTypes = data.sort((a, b) => a.id - b.id); // Updated variable name
        console.log('Fetched employee types:', this.employeeTypes);
      },
      (error) => {
        console.error('Failed to fetch employee types:', error);
        alert('Failed to fetch employee types. Please try again.');
      }
    );
  }

  // Function to delete Employee Type with ID 
  deleteEmployeeType(id: number): void { // Updated method name
    if (this.isLoggedIn) {
      this.employeeTypeService.deleteEmployeeType(id).subscribe( // Updated service method call
        () => {
          console.log('Employee type deleted successfully');
          this.fetchEmployeeTypes(); // Refresh employee types list after deletion
        },
        (error) => {
          console.error('Failed to delete employee type:', error);
          alert('Failed to delete employee type. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete employee types.');
      this.router.navigate(['/login']);
    }
  }

  // Function for delete button confirmation to delete record 
  confirm(event: Event, employeeTypeId: number): void { // Updated method name and parameter
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm to delete the record',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.deleteEmployeeType(employeeTypeId); // Updated method call
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
