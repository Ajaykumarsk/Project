import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../app.service';
import { EmployeeTypeService } from '../employeetype.service';
import { EmployeeType } from '../employeetype';

@Component({
  selector: 'app-update-employeetype',
  templateUrl: './update-employeetype.component.html',
  styleUrls: ['./update-employeetype.component.scss']
})
export class UpdateEmployeetypeComponent implements OnInit {
  employeeType: EmployeeType | undefined;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private employeeTypeService: EmployeeTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      // Add more form controls if necessary
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.userName = localStorage.getItem('name');
    const id = this.route.snapshot.params?.['id'];
    
    this.employeeTypeService.getEmployeeTypeById(id).subscribe(
      (data: EmployeeType) => {
        this.employeeType = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch employee type:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      name: this.employeeType?.name || '',
    });
  }

  // Check user authentication status
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update employee type details.');
      this.router.navigate(['/login']);
    }
  }

  // On Submit it updates the employee type name
  submit(): void {
    if (this.isLoggedIn && this.employeeType) {
      const updatedName = this.form.value.name;
      this.employeeType.name = updatedName;

      this.employeeTypeService.updateEmployeeType(this.employeeType.id, this.employeeType).subscribe(
        (data) => {
          console.log('Employee type updated successfully:', data);
          this.router.navigate(['/employeetypes']);
        },
        (error) => {
          console.error('Failed to update employee type:', error);
          // Handle error (e.g., display error message)
        }
      );
    } else {
      alert('You are not logged in. Please log in to update employee type details.');
      this.router.navigate(['/login']);
    }
  }
}