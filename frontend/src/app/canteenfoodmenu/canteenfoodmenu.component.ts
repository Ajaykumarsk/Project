import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { CanteenFoodMenuService } from '../canteenfoodmenu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CanteenFoodMenu } from '../canteenfoodmenu';

@Component({
  selector: 'app-canteenfoodmenu',
  templateUrl: './canteenfoodmenu.component.html',
  styleUrls: ['./canteenfoodmenu.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CanteenfoodmenuComponent implements OnInit {
  canteenFoodMenuForm!: FormGroup;
  displayDialog: boolean = false; // Flag to control dialog visibility
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  canteenFoodMenus: CanteenFoodMenu[] = [];
  selectedFile: File | null = null;
  displayedColumns: string[] = ['id', 'name', 'menu', 'quantity', 'calorie', 'item_photo', 'action'];
  names: { label: string, value: string }[] = [
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Snacks', value: 'Snacks' },
    { label: 'Dinner',value: 'Dinner'},
    {label : 'Mid-night Snacks',value:'Mid-night Snacks'}
  ];
  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private canteenFoodMenuService: CanteenFoodMenuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchCanteenFoodMenus();
  }

  initializeForm(): void {
    this.canteenFoodMenuForm = this.fb.group({
      name: ['', Validators.required],
      menu: ['', Validators.required],
      quantity: ['', Validators.required],
      calorie: ['', Validators.required],
      item_photo: [null]
    });
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage canteen food menu.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.canteenFoodMenuForm.reset();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addCanteenFoodMenu(): void {
    if (this.canteenFoodMenuForm.valid) {
      const formData = new FormData();
      Object.entries(this.canteenFoodMenuForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      if (this.selectedFile) {
        formData.append('item_photo', this.selectedFile, this.selectedFile.name);
      }

      this.canteenFoodMenuService.addCanteenFoodMenu(formData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food menu item added successfully!' });
          this.fetchCanteenFoodMenus();
          this.hideDialog();
        },
        (error) => {
          console.error('Failed to add food menu item:', error);
          alert('Failed to add food menu item. Please try again.');
        }
      );
    }
  }

  fetchCanteenFoodMenus(): void {
    this.canteenFoodMenuService.getCanteenFoodMenus().subscribe(
      (data: CanteenFoodMenu[]) => {
        this.canteenFoodMenus = data.sort((a, b) => a.id - b.id);
      },
      (error) => {
        console.error('Failed to fetch canteen food menus:', error);
        alert('Failed to fetch canteen food menus. Please try again.');
      }
    );
  }

  deleteCanteenFoodMenu(id: number): void {
    if (this.isLoggedIn) {
      this.canteenFoodMenuService.deleteCanteenFoodMenu(id).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food menu item deleted successfully!' });
          this.fetchCanteenFoodMenus();
        },
        (error) => {
          console.error('Failed to delete food menu item:', error);
          alert('Failed to delete food menu item. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete food menu items.');
      this.router.navigate(['/login']);
    }
  }

  confirm(event: Event, id: number): void {
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
        this.deleteCanteenFoodMenu(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
