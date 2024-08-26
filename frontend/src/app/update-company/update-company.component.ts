import { Component, OnInit } from '@angular/core';
import { Company } from '../company';
import { CompanyService } from '../company.service';
import { UserService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrl: './update-company.component.scss'
})
export class UpdateCompanyComponent implements OnInit {
  company: Company | undefined;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
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
    
    this.companyService.getCompanyById(id).subscribe(
      (data: Company) => {
        this.company = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch location:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      name: this.company?.name || '',
    });
  }

  
  // Check user authentication status
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update location details.');
      this.router.navigate(['/login']);
    }
  }

  //On Submit it updates the location name
  submit(): void {
    if (this.isLoggedIn && this.company) {
      const updatedName = this.form.value.name;
      this.company.name = updatedName;

      this.companyService.updateCompany(this.company.id, this.company).subscribe(
        (data) => {
          console.log('Location updated successfully:', data);
          this.router.navigate(['/company']); // Redirect to dashboard or location list
        },
        (error) => {
          console.error('Failed to update location:', error);
          // Handle error (e.g., display error message)
        }
      );
    } else {
      alert('You are not logged in. Please log in to update location details.');
      this.router.navigate(['/login']);
    }
  }


}