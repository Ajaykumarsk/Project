import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { EmployeeType } from './employeetype';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService { // Updated service name to EmployeeTypeService
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }
  // Fetch all employee types
  getEmployeeTypes(): Observable<EmployeeType[]> { // Updated method name to getEmployeeTypes
    return this.http.get<EmployeeType[]>(`${this.apiUrl}/employeetypes/`, { headers: this.getHeaders() }) // Updated URL to /employee-types/
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch an EmployeeType by ID
  getEmployeeTypeById(id: number): Observable<EmployeeType> { // Updated method name to getEmployeeTypeById
    const url = `${this.apiUrl}/employeetypes/${id}/`; // Updated URL to /employee-types/
    return this.http.get<EmployeeType>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new EmployeeType
  addEmployeeType(employeeType: EmployeeType): Observable<EmployeeType> { // Updated method name to addEmployeeType
    return this.http.post<EmployeeType>(`${this.apiUrl}/employeetypes/`, employeeType, { headers: this.getHeaders() }) // Updated URL to /employee-types/
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing EmployeeType
  updateEmployeeType(id: number, employeeType: EmployeeType): Observable<EmployeeType> { // Updated method name to updateEmployeeType
    const url = `${this.apiUrl}/employeetypes/${id}/`; // Updated URL to /employee-types/
    return this.http.put<EmployeeType>(url, employeeType, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete an EmployeeType by ID
  deleteEmployeeType(id: number): Observable<any> { // Updated method name to deleteEmployeeType
    const url = `${this.apiUrl}/employeetypes/${id}/`; // Updated URL to /employee-types/
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
