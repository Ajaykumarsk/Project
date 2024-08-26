import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CanteenFoodRate } from '../canteen-food-rate';
import { CanteenFoodRateService } from '../canteen-food-rate.service';
import { CatererService } from '../caterer.service'; 
import { EmployeeTypeService } from '../employeetype.service';
import { EmployeeType } from '../employeetype';
import { Caterer } from '../caterer';

@Component({
  selector: 'app-canteenfoodrate',
  templateUrl: './canteenfoodrate.component.html',
  styleUrls: ['./canteenfoodrate.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CanteenfoodrateComponent implements OnInit {
  canteenFoodRateForm!: FormGroup;
  displayDialog: boolean = false;
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  canteenFoodRates: CanteenFoodRate[] = [];
  employeeTypes: EmployeeType[] = [];
  caterers: Caterer[] = [];
  displayedColumns: string[] = [
    'id', 
    'caterer_name', 
    'canteen_item_name', 
    'valid_from', 
    'valid_to', 
    'employer_contribution',
    'employee_contribution',
    'caterer_price',
    'employee_type', 
    'action'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private canteenFoodRateService: CanteenFoodRateService,
    private employeeTypeService: EmployeeTypeService,
    private catererService: CatererService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchCanteenFoodRates();
    this.fetchEmployeeTypes();
    this.fetchCaterers();
  }

  initializeForm(): void {
    this.canteenFoodRateForm = this.fb.group({
      caterer: [null, Validators.required], 
      canteen_item_name: ['', Validators.required],
      valid_from: ['', Validators.required],
      valid_to: ['', Validators.required],
      employer_contribution: [0, Validators.required],
      employee_contribution: [0, Validators.required],
      caterer_price: [{ value: 0, disabled: true }], // Disable the field
      employee_type: [null, Validators.required]
    });

    this.onValueChanges();
  }

  onValueChanges(): void {
    this.canteenFoodRateForm.get('employer_contribution')?.valueChanges.subscribe(() => {
      this.updateCatererPrice();
    });
    this.canteenFoodRateForm.get('employee_contribution')?.valueChanges.subscribe(() => {
      this.updateCatererPrice();
    });
  }

  updateCatererPrice(): void {
    const employerContribution = this.canteenFoodRateForm.get('employer_contribution')?.value || 0;
    const employeeContribution = this.canteenFoodRateForm.get('employee_contribution')?.value || 0;
    this.canteenFoodRateForm.get('caterer_price')?.setValue(employerContribution + employeeContribution, { emitEvent: false });
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage canteen food rates.');
      this.router.navigate(['/login']);
    }
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.canteenFoodRateForm.reset();
  }

  addCanteenFoodRate(): void {
    if (this.canteenFoodRateForm.valid) {
      const formValues = this.canteenFoodRateForm.value;
      this.canteenFoodRateService.addCanteenFoodRate({
        caterer_name: formValues.caterer?.id, // Send ID
        canteen_item_name: formValues.canteen_item_name,
        valid_from: formValues.valid_from,
        valid_to: formValues.valid_to,
        employer_contribution: formValues.employer_contribution,
        employee_contribution: formValues.employee_contribution,
        caterer_price: formValues.caterer_price,
        employee_type: formValues.employee_type?.id, // Send ID
        id: 0
      }).subscribe(
        () => {
          console.log('Canteen food rate added successfully');
          this.fetchCanteenFoodRates();
          this.hideDialog();
        },
        (error) => {
          console.error('Failed to add canteen food rate:', error);
          alert('Failed to add canteen food rate. Please try again.');
        }
      );
    }
  }

  fetchCanteenFoodRates(): void {
    this.canteenFoodRateService.getCanteenFoodRates().subscribe(
      (data: CanteenFoodRate[]) => {
        this.canteenFoodRates = data.sort((a, b) => a.id - b.id);
        console.log('Fetched canteen food rates:', this.canteenFoodRates);
      },
      (error) => {
        console.error('Failed to fetch canteen food rates:', error);
        alert('Failed to fetch canteen food rates. Please try again.');
      }
    );
  }

  fetchEmployeeTypes(): void {
    this.employeeTypeService.getEmployeeTypes().subscribe(
      (data: EmployeeType[]) => {
        this.employeeTypes = data;
      },
      (error) => {
        console.error('Failed to fetch employee types:', error);
        alert('Failed to fetch employee types. Please try again.');
      }
    );
  }

  fetchCaterers(): void {
    this.catererService.getCaterers().subscribe(
      (data: Caterer[]) => {
        this.caterers = data;
      },
      (error) => {
        console.error('Failed to fetch caterers:', error);
        alert('Failed to fetch caterers. Please try again.');
      }
    );
  }

  deleteCanteenFoodRate(id: number): void {
    if (this.isLoggedIn) {
      this.canteenFoodRateService.deleteCanteenFoodRate(id).subscribe(
        () => {
          console.log('Canteen food rate deleted successfully');
          this.fetchCanteenFoodRates();
        },
        (error) => {
          console.error('Failed to delete canteen food rate:', error);
          alert('Failed to delete canteen food rate. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete canteen food rates.');
      this.router.navigate(['/login']);
    }
  }

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
        this.deleteCanteenFoodRate(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  // Helper method to get the caterer name by ID
  getCatererName(id: number): string {
    const caterer = this.caterers.find(c => c.id === id);
    return caterer ? caterer.caterer_name : 'Unknown';
  }

  // Helper method to get the employee type name by ID
  getEmployeeTypeName(id: number): string {
    const employeeType = this.employeeTypes.find(e => e.id === id);
    return employeeType ? employeeType.name : 'Unknown';
  }
}
