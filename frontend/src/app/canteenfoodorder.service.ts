import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CanteenFoodOrder } from './canteenfoodorder';

@Injectable({
  providedIn: 'root'
})
export class CanteenFoodOrderService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  // Fetch all canteen food orders
  getCanteenFoodOrders(): Observable<CanteenFoodOrder[]> {
    return this.http.get<CanteenFoodOrder[]>(`${this.apiUrl}/canteenfoodordertiming/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a canteen food order by ID
  getCanteenFoodOrderById(id: number): Observable<CanteenFoodOrder> {
    const url = `${this.apiUrl}/canteenfoodordertiming/${id}/`;
    return this.http.get<CanteenFoodOrder>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new canteen food order
  addCanteenFoodOrder(canteenFoodOrder: CanteenFoodOrder): Observable<CanteenFoodOrder> {
    return this.http.post<CanteenFoodOrder>(`${this.apiUrl}/canteenfoodordertiming/`, canteenFoodOrder, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing canteen food order
  updateCanteenFoodOrder(id: number, canteenFoodOrder: CanteenFoodOrder): Observable<CanteenFoodOrder> {
    const url = `${this.apiUrl}/canteenfoodordertiming/${id}/`;
    return this.http.put<CanteenFoodOrder>(url, canteenFoodOrder, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a canteen food order by ID
  deleteCanteenFoodOrder(id: number): Observable<any> {
    const url = `${this.apiUrl}/canteenfoodordertiming/${id}/`;
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
