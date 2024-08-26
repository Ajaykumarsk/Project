// location.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { LocationService } from '../location.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class LocationComponent implements OnInit {
  locationForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  locations: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchLocations();
  }

  initializeForm(): void {
    this.locationForm = this.fb.group({
      locationName: ['', Validators.required]
    });
  }

  //To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage locations.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.locationForm.reset(); // Reset form when dialog is closed
  }

  //Function To add Location 
  addLocation(): void {
    if (this.locationForm.valid) {
      const locationName = this.locationForm.value.locationName;
      this.locationService.addLocation({
        name: locationName,
        id: 0
      }).subscribe(
        () => {
          console.log('Location added successfully');
          this.fetchLocations(); // Refresh location list after addition
          this.hideDialog(); // Hide dialog after successful addition
        },
        (error) => {
          console.error('Failed to add location:', error);
          alert('Failed to add location. Please try again.');
        }
      );
    }
  }

  //Function to fetch Location Details
  fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (data: any[]) => {
        this.locations = data.sort((a, b) => a.id - b.id);
        console.log('Fetched locations:', this.locations);
      },
      (error) => {
        console.error('Failed to fetch locations:', error);
        alert('Failed to fetch locations. Please try again.');
      }
    );
  }

  //Function to delete Location with ID 
  deleteLocation(id: number): void {
    if (this.isLoggedIn) {
      this.locationService.deleteLocation(id).subscribe(
        () => {
          console.log('Location deleted successfully');
          this.fetchLocations(); // Refresh location list after deletion
        },
        (error) => {
          console.error('Failed to delete location:', error);
          alert('Failed to delete location. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete locations.');
      this.router.navigate(['/login']);
    }
  }

 
  //Function for delete button confirmation to delete record 
  confirm(event: Event ,locationId : number) {
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
            this.deleteLocation(locationId);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
}
