import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanteenFoodMenuService } from '../canteenfoodmenu.service';
import { MessageService } from 'primeng/api';
import { CanteenFoodMenu } from '../canteenfoodmenu';

@Component({
  selector: 'app-updatecanteenfoodmenu',
  templateUrl: './updatecanteenfoodmenu.component.html',
  styleUrls: ['./updatecanteenfoodmenu.component.scss'],
  providers: [MessageService]
})
export class UpdatecanteenfoodmenuComponent implements OnInit {
  updateCanteenFoodMenuForm!: FormGroup;
  foodMenuId!: number;
  selectedFile: File | null = null;
  currentFoodMenu: CanteenFoodMenu | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private canteenFoodMenuService: CanteenFoodMenuService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.foodMenuId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.fetchFoodMenuDetails();
  }

  initializeForm(): void {
    this.updateCanteenFoodMenuForm = this.fb.group({
      name: ['', Validators.required],
      menu: ['', Validators.required],
      quantity: ['', Validators.required],
      calorie: ['', Validators.required],
      item_photo: [null]
    });
  }

  fetchFoodMenuDetails(): void {
    this.canteenFoodMenuService.getCanteenFoodMenuById(this.foodMenuId).subscribe(
      (data: CanteenFoodMenu) => {
        this.currentFoodMenu = data;
        this.updateCanteenFoodMenuForm.patchValue({
          name: data.name,
          menu: data.menu,
          quantity: data.quantity,
          calorie: data.calorie,
          item_photo: null
        });
      },
      (error) => {
        console.error('Failed to fetch food menu details:', error);
        alert('Failed to fetch food menu details. Please try again.');
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateCanteenFoodMenu(): void {
    if (this.updateCanteenFoodMenuForm.valid) {
      const formData = new FormData();
      Object.entries(this.updateCanteenFoodMenuForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      if (this.selectedFile) {
        formData.append('item_photo', this.selectedFile, this.selectedFile.name);
      }

      this.canteenFoodMenuService.updateCanteenFoodMenu(this.foodMenuId, formData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food menu item updated successfully!' });
          this.router.navigate(['/canteenfoodmenu']);
        },
        (error) => {
          console.error('Failed to update food menu item:', error);
          alert('Failed to update food menu item. Please try again.');
        }
      );
    }
  }
}