import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService from PrimeNG
import { ConfigService } from '../config.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Corrected styleUrls property
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  messages: any[] = []; // Change to any[] or specify Message[] if needed
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,    private authService: AuthService, // Inject MessageService
    private configService: ConfigService
  ) {
    this.apiUrl = this.configService.getApiUrl();
  }
  clearMessages() {
    this.messages = [];
  }
  // Function to check Username and Password for Login 
  login() {
    // Ensure both username and password are provided
    if (!this.username || !this.password) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username and password are required.' });
      setTimeout(() => {
        this.clearMessages();
      }, 2000);
      return;
      
    }

    // Make HTTP POST request to obtain token
    this.authService.login(this.username, this.password).subscribe(
      response => {
      // Handle successful login
      localStorage.setItem('token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('role',response.role);
      // Redirect or perform further actions
      this.router.navigate(['dashboard']);
    }, error => {
      // Handle login error
      console.error('Login failed:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Username/Password' });
      setTimeout(() => {
        this.clearMessages();
      }, 2000);
    });
  }
}
