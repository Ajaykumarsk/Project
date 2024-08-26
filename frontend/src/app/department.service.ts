import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department } from './User';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  // Fetch all departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a department by ID
  getDepartmentById(id: number): Observable<Department> {
    const url = `${this.apiUrl}/departments/${id}/`;
    return this.http.get<Department>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new department
  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments/`, department, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing department
  updateDepartment(id: number, department: Department): Observable<Department> {
    const url = `${this.apiUrl}/departments/${id}/`;
    return this.http.put<Department>(url, department, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a department by ID
  deleteDepartment(id: number): Observable<any> {
    const url = `${this.apiUrl}/departments/${id}/`;
    return this.http.delete<any>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  // Retrieve headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.append('Authorization', 'Bearer ' + token);
    }
    return headers;
  }
}
