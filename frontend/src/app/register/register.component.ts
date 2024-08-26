import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LayoutService } from '../layout/service/app.layout.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  registrationError: string = '';
messages!: Message[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public layoutService: LayoutService,
    private messageService: MessageService
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  // Custom validator to check if passwords match
  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Function to create/register new User account
  register() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registrationForm.value;

    const requestData = {
      username,
      email,
      password
    };

    console.log('Sending request to backend with data:', requestData);

    this.http.post<any>('http://localhost:8000/api/register/', requestData).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        // Registration successful, provide feedback and navigate to login
        this.messageService.add({ severity: 'success', detail: 'Registration successful. Please log in.' });
        this.registrationForm.reset();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        // Handle error
        this.messageService.add({ severity: 'error', detail: 'Registration failed. Please try again.' });
      }
    );
  }
}
