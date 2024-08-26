import { Component, OnInit } from '@angular/core';
import { UserService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanteenFoodOrder } from '../canteenfoodorder';
import { CanteenFoodOrderService } from '../canteenfoodorder.service';

@Component({
  selector: 'app-updatecanteenfoodorder',
  templateUrl: './updatecanteenfoodorder.component.html',
  styleUrls: ['./updatecanteenfoodorder.component.scss']
})
export class UpdatecanteenfoodorderComponent implements OnInit {
  canteenFoodOrder!: CanteenFoodOrder;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private canteenFoodOrderService: CanteenFoodOrderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      begin_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.userName = localStorage.getItem('name');
    const id = this.route.snapshot.params?.['id'];

    this.canteenFoodOrderService.getCanteenFoodOrderById(id).subscribe(
      (data: CanteenFoodOrder) => {
        this.canteenFoodOrder = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch canteen food order:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      name: this.canteenFoodOrder?.name || '',
      begin_time: this.canteenFoodOrder?.begin_time || '',
      end_time: this.canteenFoodOrder?.end_time || ''
    });
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update canteen food order details.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.canteenFoodOrder) {
      const updatedOrder = this.form.value;
      this.canteenFoodOrder = { ...this.canteenFoodOrder, ...updatedOrder };

      this.canteenFoodOrderService.updateCanteenFoodOrder(this.canteenFoodOrder.id, this.canteenFoodOrder).subscribe(
        (data) => {
          console.log('Canteen food order updated successfully:', data);
          this.router.navigate(['/canteenfoodordertiming']);
        },
        (error) => {
          console.error('Failed to update canteen food order:', error);
        }
      );
    } else {
      alert('You are not logged in. Please log in to update canteen food order details.');
      this.router.navigate(['/login']);
    }
  }
}
