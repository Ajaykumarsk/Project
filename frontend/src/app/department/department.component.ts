import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { DepartmentService } from '../department.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  departments: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private router: Router,private confirmationService: ConfirmationService, private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeDepartmentForm();
    this.userName = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchDepartments();
  }

  initializeDepartmentForm(): void {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  //To Check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.messageService.add({ severity: 'error', summary: 'Authentication Required', detail: 'You are not logged in. Please log in to manage departments.' });
      this.router.navigate(['/login']); // Redirect to login page if not logged in
    }
  }
  

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.departmentForm.reset(); // Reset form when dialog is closed
  }

  //Function to add Department 
  addDepartment(): void {
    if (this.departmentForm.valid) {
      const departmentName = this.departmentForm.value.departmentName;
      this.departmentService.addDepartment({
        name: departmentName,
        id: 0
      }).subscribe(
        () => {
          console.log('Department added successfully');
          this.fetchDepartments(); // Refresh department list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          console.error('Failed to add department:', error);
          alert('Failed to add department. Please try again.');
        }
      );
    }
  }

  //Function to Fetch Department Details to display in Table
  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data: any[]) => {
        this.departments = data.sort((a, b) => a.id - b.id);
        console.log('Fetched departments:', this.departments);
      },
      (error) => {
        console.error('Failed to fetch departments:', error);
        alert('Failed to fetch departments. Please try again.');
      }
    );
  }

  //function to delete Department 
  deleteDepartment(id: number): void {
    if (this.isLoggedIn) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          console.log('Department deleted successfully');
          this.fetchDepartments(); // Refresh department list after deletion
        },
        (error) => {
          console.error('Failed to delete department:', error);
          alert('Failed to delete department. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete departments.');
      this.router.navigate(['/login']);
    }
  }


  //Function for delete button confirmation to delete record 
  confirm(event: Event ,departmentId : number) {
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
            this.deleteDepartment(departmentId);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}
}
