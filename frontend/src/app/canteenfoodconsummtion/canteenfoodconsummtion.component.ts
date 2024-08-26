import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { CanteenFoodConsummationTimingService } from '../canteenfoodconsummation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CanteenFoodConsummmation } from '../canteenfoodconsummation';

@Component({
  selector: 'app-canteenfoodconsummtion',
  templateUrl: './canteenfoodconsummtion.component.html',
  styleUrl: './canteenfoodconsummtion.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class CanteenfoodconsummtionComponent implements OnInit {
  canteenFoodConsummationForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  canteenFoodConsummations: CanteenFoodConsummmation[] = [];
  displayedColumns: string[] = ['id', 'name', 'begin_time', 'end_time', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private canteenFoodConsummationService: CanteenFoodConsummationTimingService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchCanteenFoodConsummations();
  }

  initializeForm(): void {
    this.canteenFoodConsummationForm = this.fb.group({
      name: ['', Validators.required],
      begin_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  }

  // To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage canteen food timings.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.canteenFoodConsummationForm.reset(); // Reset form when dialog is closed
  }

  // Function To add CanteenFoodConsummationTiming 
  addCanteenFoodConsummation(): void {
    if (this.canteenFoodConsummationForm.valid) {
      const formValues = this.canteenFoodConsummationForm.value;
      this.canteenFoodConsummationService.addCanteenFoodConsummation({
        name: formValues.name,
        begin_time: formValues.begin_time,
        end_time: formValues.end_time,
        id: 0 // Assuming new entry
      }).subscribe(
        () => {
          console.log('Canteen food consummation timing added successfully');
          this.fetchCanteenFoodConsummations(); // Refresh list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          console.error('Failed to add canteen food consummation timing:', error);
          alert('Failed to add canteen food consummation timing. Please try again.');
        }
      );
    }
  }

  // Function to fetch CanteenFoodConsummationTiming Details
  fetchCanteenFoodConsummations(): void {
    this.canteenFoodConsummationService.getcanteenfoodconsummation().subscribe(
      (data: CanteenFoodConsummmation[]) => {
        this.canteenFoodConsummations = data.sort((a, b) => a.id - b.id);
        console.log('Fetched canteen food consummations:', this.canteenFoodConsummations);
      },
      (error) => {
        console.error('Failed to fetch canteen food consummations:', error);
        alert('Failed to fetch canteen food consummations. Please try again.');
      }
    );
  }

  // Function to delete CanteenFoodConsummationTiming with ID 
  deleteCanteenFoodConsummation(id: number): void {
    if (this.isLoggedIn) {
      this.canteenFoodConsummationService.deleteCanteenFoodConsummation(id).subscribe(
        () => {
          console.log('Canteen food consummation timing deleted successfully');
          this.fetchCanteenFoodConsummations(); // Refresh list after deletion
        },
        (error) => {
          console.error('Failed to delete canteen food consummation timing:', error);
          alert('Failed to delete canteen food consummation timing. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete canteen food consummation timings.');
      this.router.navigate(['/login']);
    }
  }

  // Function for delete button confirmation to delete record 
  confirm(event: Event, id: number) {
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
        this.deleteCanteenFoodConsummation(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
