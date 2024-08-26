import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CanteenFoodRate } from './canteen-food-rate';

@Injectable({
  providedIn: 'root'
})
export class CanteenFoodRateService {
  private apiUrl = 'http://localhost:8000/api/canteenfoodrate/';

  constructor(private http: HttpClient) { }

  getCanteenFoodRates(): Observable<CanteenFoodRate[]> {
    return this.http.get<CanteenFoodRate[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCanteenFoodRateById(id: number): Observable<CanteenFoodRate> {
    return this.http.get<CanteenFoodRate>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  addCanteenFoodRate(canteenFoodRate: CanteenFoodRate): Observable<CanteenFoodRate> {
    return this.http.post<CanteenFoodRate>(this.apiUrl, canteenFoodRate).pipe(
      catchError(this.handleError)
    );
  }

  updateCanteenFoodRate(id: number, canteenFoodRate: CanteenFoodRate): Observable<CanteenFoodRate> {
    return this.http.put<CanteenFoodRate>(`${this.apiUrl}${id}/`, canteenFoodRate).pipe(
      catchError(this.handleError)
    );
  }

  deleteCanteenFoodRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
