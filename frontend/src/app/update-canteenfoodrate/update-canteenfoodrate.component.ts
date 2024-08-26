import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanteenFoodRate } from '../canteen-food-rate';
import { CanteenFoodRateService } from '../canteen-food-rate.service';
import { UserService } from '../app.service';
import { CatererService } from '../caterer.service';
import { EmployeeType } from '../employeetype';
import { EmployeeTypeService } from '../employeetype.service';
import { Caterer } from '../caterer';

@Component({
  selector: 'app-update-canteen-food-rate',
  templateUrl: './update-canteenfoodrate.component.html',
  styleUrls: ['./update-canteenfoodrate.component.scss']
})
export class UpdateCanteenfoodrateComponent implements OnInit {
  canteenFoodRate!: CanteenFoodRate;
  caterers: Caterer[] = [];
  employeeTypes: EmployeeType[] = [];
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private canteenFoodRateService: CanteenFoodRateService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private catererService: CatererService,
    private employeeTypeService: EmployeeTypeService
  ) {
    this.form = this.fb.group({
      caterer: [null, Validators.required],
      canteen_item_name: ['', Validators.required],
      valid_from: ['', Validators.required],
      valid_to: ['', Validators.required],
      employer_contribution: ['', Validators.required],
      employee_contribution: ['', Validators.required],
      caterer_price: ['', Validators.required],
      employee_type: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.userName = localStorage.getItem('name');
    const id = this.route.snapshot.params?.['id'];

    this.canteenFoodRateService.getCanteenFoodRateById(id).subscribe(
      (data: CanteenFoodRate) => {
        this.canteenFoodRate = data;
        this.fetchCaterers();
        this.fetchEmployeeTypes();
      },
      (error) => {
        console.error('Failed to fetch canteen food rate:', error);
      }
    );
  }

  fetchCaterers(): void {
    this.catererService.getCaterers().subscribe(
      (data: Caterer[]) => {
        this.caterers = data;
        console.log('Fetched caterers:', this.caterers);
        this.initializeForm(); // Initialize form after fetching caterers
      },
      (error) => {
        console.error('Failed to fetch caterers:', error);
        alert('Failed to fetch caterers. Please try again.');
      }
    );
  }

  fetchEmployeeTypes(): void {
    this.employeeTypeService.getEmployeeTypes().subscribe(
      (data: EmployeeType[]) => {
        this.employeeTypes = data;
        console.log('Fetched employee types:', this.employeeTypes);
        this.initializeForm(); // Initialize form after fetching employee types
      },
      (error) => {
        console.error('Failed to fetch employee types:', error);
        alert('Failed to fetch employee types. Please try again.');
      }
    );
  }

  initializeForm(): void {
    if (this.canteenFoodRate && this.caterers.length > 0 && this.employeeTypes.length > 0) {
      const selectedCaterer = this.caterers.find(caterer => caterer.id === this.canteenFoodRate.caterer_name);
      const selectedEmployeeType = this.employeeTypes.find(employeeType => employeeType.id === this.canteenFoodRate.employee_type);

      console.log('Selected Caterer:', selectedCaterer);
      console.log('Selected Employee Type:', selectedEmployeeType);

      this.form.patchValue({
        caterer: selectedCaterer || null,
        canteen_item_name: this.canteenFoodRate.canteen_item_name || '',
        valid_from: this.canteenFoodRate.valid_from || '',
        valid_to: this.canteenFoodRate.valid_to || '',
        employer_contribution: this.canteenFoodRate.employer_contribution || '',
        employee_contribution: this.canteenFoodRate.employee_contribution || '',
        caterer_price: this.canteenFoodRate.caterer_price || '',
        employee_type: selectedEmployeeType || null
      });
    }
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update canteen food rate details.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.canteenFoodRate) {
      const formValues = this.form.value;

      const updatedCanteenFoodRate: CanteenFoodRate = {
        ...this.canteenFoodRate,
        caterer_name: formValues.caterer?.id, // Ensure this is correct
        canteen_item_name: formValues.canteen_item_name,
        valid_from: formValues.valid_from,
        valid_to: formValues.valid_to,
        employer_contribution: formValues.employer_contribution,
        employee_contribution: formValues.employee_contribution,
        caterer_price: formValues.caterer_price,
        employee_type: formValues.employee_type?.id // Ensure this is correct
      };

      if (this.canteenFoodRate.id !== undefined) {
        this.canteenFoodRateService.updateCanteenFoodRate(this.canteenFoodRate.id, updatedCanteenFoodRate).subscribe(
          (data) => {
            console.log('Canteen food rate updated successfully:', data);
            this.router.navigate(['/canteenfoodrate']);
          },
          (error) => {
            console.error('Failed to update canteen food rate:', error);
            alert('Failed to update canteen food rate. Please try again.');
          }
        );
      } else {
        console.error('Canteen food rate ID is undefined');
      }
    } else {
      alert('You are not logged in. Please log in to update canteen food rate details.');
      this.router.navigate(['/login']);
    }
  }
}
