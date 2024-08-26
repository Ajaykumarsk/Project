import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CanteenFoodConsummmation } from './canteenfoodconsummation';

@Injectable({
  providedIn: 'root'
})
export class CanteenFoodConsummationTimingService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }
  // Fetch all companys
  getcanteenfoodconsummation(): Observable<CanteenFoodConsummmation[]> {
    return this.http.get<CanteenFoodConsummmation[]>(`${this.apiUrl}/canteenfoodconsummationtiming/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a Company by ID
  getCanteenFoodConsummationById(id: number): Observable<CanteenFoodConsummmation> {
    const url = `${this.apiUrl}/canteenfoodconsummationtiming/${id}/`;
    return this.http.get<CanteenFoodConsummmation>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new Company
  addCanteenFoodConsummation(canteenfoodconsummation: CanteenFoodConsummmation): Observable<CanteenFoodConsummmation> {
    return this.http.post<CanteenFoodConsummmation>(`${this.apiUrl}/canteenfoodconsummationtiming/`, canteenfoodconsummation, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing Company
  updateCanteenFoodConsummation(id: number, canteenfoodconsummation: CanteenFoodConsummmation): Observable<CanteenFoodConsummmation> {
    const url = `${this.apiUrl}/canteenfoodconsummationtiming/${id}/`;
    return this.http.put<CanteenFoodConsummmation>(url, canteenfoodconsummation, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a Company by ID
  deleteCanteenFoodConsummation(id: number): Observable<any> {
    const url = `${this.apiUrl}/canteenfoodconsummationtiming/${id}/`;
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
