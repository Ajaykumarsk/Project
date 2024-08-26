import { Component, OnInit } from '@angular/core';
import { UserService } from '../app.service'; // Adjust path as necessary

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userName: string | null = '';
  userRole: string | null = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName'); // Adjust key as necessary
    this.userRole = localStorage.getItem('role'); // Adjust key as necessary
  }
}
