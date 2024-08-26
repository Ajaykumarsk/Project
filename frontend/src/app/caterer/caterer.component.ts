import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { CatererService } from '../caterer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Caterer } from '../caterer';

@Component({
  selector: 'app-caterer',
  templateUrl: './caterer.component.html',
  styleUrls: ['./caterer.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CatererComponent implements OnInit {
  catererForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  caterers: Caterer[] = []; // Use the Caterer interface here
  displayedColumns: string[] = ['id', 'caterer_name', 'canteen_item_name', 'valid_from', 'valid_to', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private catererService: CatererService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchCaterers();
  }

  initializeForm(): void {
    this.catererForm = this.fb.group({
      catererName: ['', Validators.required],
      canteenItemName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required]
    });
  }
  

  // To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.messageService.add({ severity: 'error', summary: 'Authentication Required', detail: 'You are not logged in. Please log in to manage caterers.' });
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.catererForm.reset(); // Reset form when dialog is closed
  }

  // Function to add Caterer
  addCaterer(): void {
    if (this.catererForm.valid) {
      console.log(this.catererForm.value);
  
      const caterer: Caterer = {
        caterer_name: this.catererForm.value.catererName,
        canteen_item_name: this.catererForm.value.canteenItemName, // Ensure this matches the API field name
        valid_from: this.catererForm.value.validFrom,
        valid_to: this.catererForm.value.validTo,
        id: 0
      };
  
      this.catererService.addCaterer(caterer).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Caterer added successfully' });
          this.fetchCaterers(); // Refresh caterer list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add caterer. Please try again.' });
          console.error('Failed to add caterer:', error);
        }
      );
    }
  }
  
  

  // Function to fetch Caterer Details
  fetchCaterers(): void {
    this.catererService.getCaterers().subscribe(
      (data: Caterer[]) => {
        this.caterers = data.sort((a, b) => a.id! - b.id!); // Handle optional id
        console.log('Fetched caterers:', this.caterers);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch caterers. Please try again.' });
        console.error('Failed to fetch caterers:', error);
      }
    );
  }

  // Function to delete Caterer with ID
  deleteCaterer(id: number): void {
    if (this.isLoggedIn) {
      this.catererService.deleteCaterer(id).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Caterer deleted successfully' });
          this.fetchCaterers(); // Refresh caterer list after deletion
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete caterer. Please try again.' });
          console.error('Failed to delete caterer:', error);
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Authentication Required', detail: 'You are not logged in. Please log in to delete caterers.' });
      this.router.navigate(['/login']);
    }
  }

  // Function for delete button confirmation to delete record
  confirm(event: Event, catererId: number) {
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
        this.deleteCaterer(catererId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
