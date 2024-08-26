import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-empolyee-dashboard',
  templateUrl: './empolyee-dashboard.component.html',
  styleUrl: './empolyee-dashboard.component.scss'
})
export class EmpolyeeDashboardComponent implements OnInit {
  totalUsers: number = 0;
  maleUsers: number = 0;
  femaleUsers: number = 0;
  totalDepartments: number = 0;
  totalLocations: number = 0;
  isLoggedIn: boolean = false;
  name: string | null | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private departmentService: DepartmentService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.name = localStorage.getItem('name');
  }

  //Function to check Authentication 
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn(); // Implement this method in your UserService to check if user is logged in

    if (this.isLoggedIn) {
      this.getUserStatistics();
    } else {
      this.router.navigate(['/login']); // Redirect to login page if user is not logged in
    }
  }

  //Function to get count of Total,Male,Female Users and Department,Location count 
  getUserStatistics(): void {
    // Fetch users
    this.userService.getUsers().subscribe(
      users => {
        this.totalUsers = users.length;
        this.maleUsers = users.filter(user => user.gender === 'Male').length;
        this.femaleUsers = users.filter(user => user.gender === 'Female').length;
      },
      error => {
        console.error('Failed to fetch users:', error);
        // Handle the error appropriately (e.g., show a message to the user)
      }
    );

    // Fetch departments
    this.departmentService.getDepartments().subscribe(
      departments => {
        this.totalDepartments = departments.length;
      },
      error => {
        console.error('Failed to fetch departments:', error);
        // Handle the error appropriately (e.g., show a message to the user)
      }
    );

    // Fetch locations
    this.locationService.getLocations().subscribe(
      locations => {
        this.totalLocations = locations.length;
      },
      error => {
        console.error('Failed to fetch locations:', error);
        // Handle the error appropriately (e.g., show a message to the user)
      }
    );
  }

}