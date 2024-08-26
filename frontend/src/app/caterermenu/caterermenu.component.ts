import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CanteenFoodMenuService } from '../canteenfoodmenu.service';
import { CatererService } from '../caterer.service';
import { CatererMenuService } from '../caterermenu.service';

@Component({
  selector: 'app-caterermenu',
  templateUrl: './caterermenu.component.html',
  styleUrls: ['./caterermenu.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CaterermenuComponent implements OnInit {
  catererMenus: any[] = [];
  catererOptions: any[] = [];
  foodMenuOptions: any[] = [];
  selectedMenu: any | null = null;
  displayDialog: boolean = false;
  catererMenuForm: FormGroup;
  foodTypeOptions: any[] = [];
  filteredFoodMenuOptions: any[] = [];

  constructor(
    private catererMenuService: CatererMenuService,
    private catererService: CatererService,
    private foodMenuService: CanteenFoodMenuService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.catererMenuForm = this.fb.group({
      catererName: [null, Validators.required],
      foodType: [null, Validators.required],
      foodMenu: [[], Validators.required],
      quantity: [{ value: '', disabled: true }],
      calorie: [{ value: '', disabled: true }],
      item_photo: [{ value: '', disabled: true }],
      valid_from: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCatererMenus();
    this.loadCatererOptions();
    this.loadFoodTypeOptions();
    this.loadFoodMenuOptions();

    this.catererMenuForm.get('foodMenu')?.valueChanges.subscribe((selectedFoodMenuId) => {
      this.onFoodMenuSelected(selectedFoodMenuId);
    });

    this.catererMenuForm.get('foodType')?.valueChanges.subscribe(() => {
      this.filterFoodMenus();
    });
  }

  loadCatererMenus(): void {
    this.catererMenuService.getCatererMenus().subscribe(
      (data: any[]) => {
        this.catererMenus = data;
      },
      error => {
        console.error('Error fetching caterer menus:', error);
      }
    );
  }

  loadCatererOptions(): void {
    this.catererService.getCaterers().subscribe(
      (data: any[]) => {
        this.catererOptions = data.map(caterer => ({
          label: caterer.caterer_name,
          value: caterer.id
        }));
        console.log('Mapped Caterer Options:', this.catererOptions);
      },
      error => {
        console.error('Error fetching caterers:', error);
      }
    );
  }
  getCatererName(catererId: number): string {
    const caterer = this.catererOptions.find(option => option.value === catererId);
    return caterer ? caterer.label : 'Unknown';
  }
  
  loadFoodTypeOptions(): void {
    // Load food types from the service or define them here
    this.foodTypeOptions = [
      { label: 'Breakfast', value: 'Breakfast' },
      { label: 'LUNCH', value: 'LUNCH' },
      { label: 'Snacks', value: 'Snacks' }
  ];
  
  }

  loadFoodMenuOptions(): void {
    this.foodMenuService.getCanteenFoodMenus().subscribe(
        (data: any[]) => {
            this.foodMenuOptions = data.map(foodMenu => ({
                label: `${foodMenu.menu} - ${foodMenu.name}`,  // Combine menu and name for display
                value: foodMenu.id,
                type: foodMenu.menu  // Ensure this type is set correctly based on the menu
            }));
            console.log('Food Menu Options:', this.foodMenuOptions);
        },
        error => {
            console.error('Error fetching food menus:', error);
        }
    );
}

filterFoodMenus(): void {
  const selectedFoodType = this.catererMenuForm.get('foodType')?.value?.value; // Extracting the 'value' property
  console.log('Selected Food Type:', selectedFoodType); // Debugging line
  
  if (selectedFoodType) {
      this.filteredFoodMenuOptions = this.foodMenuOptions.filter(menu => menu.label.includes(selectedFoodType));
  } else {
      this.filteredFoodMenuOptions = this.foodMenuOptions; // Show all if no type selected
  }
  console.log('Filtered Food Menu Options:', this.filteredFoodMenuOptions); // Debugging line
  console.log('Food Menu Options:', this.foodMenuOptions); // Before filtering
console.log('Selected Food Type:', selectedFoodType); // Correctly extracted value

}





  onFoodMenuSelected(selectedFoodMenuIds: number[]): void {
    const selectedFoodMenus = this.foodMenuOptions.filter(menu => selectedFoodMenuIds.includes(menu.value));
    
    if (selectedFoodMenus.length > 0) {
      const firstSelectedMenuId = selectedFoodMenus[0].value;

      this.foodMenuService.getCanteenFoodMenuById(firstSelectedMenuId).subscribe(
        (menuDetails: any) => {
          this.catererMenuForm.patchValue({
            quantity: menuDetails.quantity,
            calorie: menuDetails.calorie,
            item_photo: menuDetails.item_photo,
            valid_from: menuDetails.valid_from
          });
        },
        error => {
          console.error('Error fetching food menu details:', error);
        }
      );
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.catererMenuForm.reset();
  }

  addCatererMenu(): void {
    if (this.catererMenuForm.valid) {
      const formValue = this.catererMenuForm.getRawValue();
      const formData = {
        caterer_name: formValue.catererName.value,
        food_menu: formValue.foodMenu,
        valid_from: formValue.valid_from,
      };
  
      this.catererMenuService.createCatererMenu(formData).subscribe(
        () => {
          this.loadCatererMenus();
          this.hideDialog();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Caterer Menu added successfully!' });
        },
        error => {
          console.error('Error adding caterer menu:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add caterer menu.' });
        }
      );
    } else {
      console.log('Form is invalid. Current value:', this.catererMenuForm.value);
    }
  }

  confirmDelete(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Are you sure you want to delete this item?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMenu(id);
      }
    });
  }

  deleteMenu(id: number): void {
    this.catererMenuService.deleteCatererMenu(id).subscribe(
      () => {
        this.catererMenus = this.catererMenus.filter(menu => menu.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Caterer Menu deleted successfully!' });
      },
      error => {
        console.error('Error deleting caterer menu:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete caterer menu.' });
      }
    );
  }
}
