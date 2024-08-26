import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { CanteenFoodOrderService } from '../canteenfoodorder.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CanteenFoodOrder } from '../canteenfoodorder';

@Component({
  selector: 'app-canteenfoodorder',
  templateUrl: './canteenfoodorder.component.html',
  styleUrls: ['./canteenfoodorder.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CanteenfoodorderComponent implements OnInit {
  canteenFoodOrderForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  canteenFoodOrders: CanteenFoodOrder[] = [];
  displayedColumns: string[] = ['id', 'name', 'begin_time', 'end_time', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private canteenFoodOrderService: CanteenFoodOrderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchCanteenFoodOrders();
  }

  initializeForm(): void {
    this.canteenFoodOrderForm = this.fb.group({
      name: ['', Validators.required],
      begin_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  }

  // To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage canteen food orders.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.canteenFoodOrderForm.reset(); // Reset form when dialog is closed
  }

  // Function To add CanteenFoodOrder
  addCanteenFoodOrder(): void {
    if (this.canteenFoodOrderForm.valid) {
      const formValues = this.canteenFoodOrderForm.value;
      this.canteenFoodOrderService.addCanteenFoodOrder({
        name: formValues.name,
        begin_time: formValues.begin_time,
        end_time: formValues.end_time,
        id: 0 // Assuming new entry
      }).subscribe(
        () => {
          console.log('Canteen food order added successfully');
          this.fetchCanteenFoodOrders(); // Refresh list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          console.error('Failed to add canteen food order:', error);
          alert('Failed to add canteen food order. Please try again.');
        }
      );
    }
  }

  // Function to fetch CanteenFoodOrder Details
  fetchCanteenFoodOrders(): void {
    this.canteenFoodOrderService.getCanteenFoodOrders().subscribe(
      (data: CanteenFoodOrder[]) => {
        this.canteenFoodOrders = data.sort((a, b) => a.id - b.id);
        console.log('Fetched canteen food orders:', this.canteenFoodOrders);
      },
      (error) => {
        console.error('Failed to fetch canteen food orders:', error);
        alert('Failed to fetch canteen food orders. Please try again.');
      }
    );
  }

  // Function to delete CanteenFoodOrder with ID
  deleteCanteenFoodOrder(id: number): void {
    if (this.isLoggedIn) {
      this.canteenFoodOrderService.deleteCanteenFoodOrder(id).subscribe(
        () => {
          console.log('Canteen food order deleted successfully');
          this.fetchCanteenFoodOrders(); // Refresh list after deletion
        },
        (error) => {
          console.error('Failed to delete canteen food order:', error);
          alert('Failed to delete canteen food order. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete canteen food orders.');
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
        this.deleteCanteenFoodOrder(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
