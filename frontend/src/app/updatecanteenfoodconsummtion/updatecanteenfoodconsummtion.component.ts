import { Component, OnInit } from '@angular/core';
import { UserService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanteenFoodConsummmation } from '../canteenfoodconsummation';
import { CanteenFoodConsummationTimingService } from '../canteenfoodconsummation.service';

@Component({
  selector: 'app-updatecanteenfoodconsummtion',
  templateUrl: './updatecanteenfoodconsummtion.component.html',
  styleUrl: './updatecanteenfoodconsummtion.component.scss'
})
export class UpdatecanteenfoodconsummtionComponent  implements OnInit {
  canteenFoodConsummation!: CanteenFoodConsummmation;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private canteenFoodConsummationService: CanteenFoodConsummationTimingService,
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

    this.canteenFoodConsummationService.getCanteenFoodConsummationById(id).subscribe(
      (data: CanteenFoodConsummmation) => {
        this.canteenFoodConsummation = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch canteen food consummation:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      name: this.canteenFoodConsummation?.name || '',
      begin_time: this.canteenFoodConsummation?.begin_time || '',
      end_time: this.canteenFoodConsummation?.end_time || ''
    });
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update canteen food consummation details.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.canteenFoodConsummation) {
      const updatedConsummation = this.form.value;
      this.canteenFoodConsummation = { ...this.canteenFoodConsummation, ...updatedConsummation };

      this.canteenFoodConsummationService.updateCanteenFoodConsummation(this.canteenFoodConsummation.id, this.canteenFoodConsummation).subscribe(
        (data) => {
          console.log('Canteen food consummation updated successfully:', data);
          this.router.navigate(['/canteenfoodconsummationtiming']);
        },
        (error) => {
          console.error('Failed to update canteen food consummation:', error);
        }
      );
    } else {
      alert('You are not logged in. Please log in to update canteen food consummation details.');
      this.router.navigate(['/login']);
    }
  }
}
