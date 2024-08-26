import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../app.service';
import { LocationService } from '../location.service';
import { Location } from '../Location';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {
  location: Location | undefined;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
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
    
    this.locationService.getLocationById(id).subscribe(
      (data: Location) => {
        this.location = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch location:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.patchValue({
      name: this.location?.name || '',
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
    if (this.isLoggedIn && this.location) {
      const updatedName = this.form.value.name;
      this.location.name = updatedName;

      this.locationService.updateLocation(this.location.id, this.location).subscribe(
        (data) => {
          console.log('Location updated successfully:', data);
          this.router.navigate(['/location']); // Redirect to dashboard or location list
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