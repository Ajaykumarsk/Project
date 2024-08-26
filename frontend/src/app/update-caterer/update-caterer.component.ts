import { Component, OnInit } from '@angular/core';
import { Caterer } from '../caterer'; // Adjust import to Caterer model
import { CatererService } from '../caterer.service'; // Adjust import to CatererService
import { UserService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-caterer',
  templateUrl: './update-caterer.component.html',
  styleUrls: ['./update-caterer.component.scss'] // Fixed typo here
})
export class UpdateCatererComponent implements OnInit {
  caterer!: Caterer;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private catererService: CatererService, // Updated service name
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      caterer_name: ['', Validators.required],
      canteen_item_name: ['', Validators.required],
      valid_from: ['', Validators.required],
      valid_to: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.userName = localStorage.getItem('name');
    const id = this.route.snapshot.params?.['id'];
    
    this.catererService.getCatererById(id).subscribe(
      (data: Caterer) => {
        this.caterer = data;
        this.initializeForm();
        console.log("all caterer",this.caterer);
      },
      (error) => {
        console.error('Failed to fetch caterer:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      caterer_name: this.caterer?.caterer_name || '',
      canteen_item_name: this.caterer?.canteen_item_name || '',
      valid_from: this.caterer?.valid_from || '',
      valid_to: this.caterer?.valid_to || ''
    });
  }

  // Check user authentication status
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update caterer details.');
      this.router.navigate(['/login']);
    }
  }

  // On Submit it updates the caterer details
  submit(): void {
    if (this.isLoggedIn && this.caterer) {
      const updatedCaterer: Caterer = {
        ...this.caterer,
        caterer_name: this.form.value.caterer_name,
        canteen_item_name: this.form.value.canteen_item_name,
        valid_from: this.form.value.valid_from,
        valid_to: this.form.value.valid_to
      };
  
      if (this.caterer.id !== undefined) {
        this.catererService.updateCaterer(this.caterer.id, updatedCaterer).subscribe(
          (data) => {
            console.log('Caterer updated successfully:', data);
            this.router.navigate(['/caterer']); // Redirect to dashboard or caterer list
          },
          (error) => {
            console.error('Failed to update caterer:', error);
            // Handle error (e.g., display error message)
          }
        );
      } else {
        console.error('Caterer ID is undefined');
        // Handle case when caterer ID is undefined
      }
    } else {
      alert('You are not logged in. Please log in to update caterer details.');
      this.router.navigate(['/login']);
    }
  }
  
}
