import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CanteenFoodMenu } from './canteenfoodmenu';

@Injectable({
  providedIn: 'root'
})
export class CanteenFoodMenuService {
  private apiUrl = 'http://localhost:8000/api/canteenfoodmenu/';

  constructor(private http: HttpClient) { }

  getCanteenFoodMenus(): Observable<CanteenFoodMenu[]> {
    return this.http.get<CanteenFoodMenu[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCanteenFoodMenuById(id: number): Observable<CanteenFoodMenu> {
    return this.http.get<CanteenFoodMenu>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  addCanteenFoodMenu(formData: FormData): Observable<CanteenFoodMenu> {
    return this.http.post<CanteenFoodMenu>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }
  getCanteenFoodMenusByIds(ids: number[]): Observable<any[]> {
    return this.http.post<any[]>('/api/canteen_food_menus_by_ids/', { ids });
  }
  
  updateCanteenFoodMenu(id: number, formData: FormData): Observable<CanteenFoodMenu> {
    return this.http.put<CanteenFoodMenu>(`${this.apiUrl}${id}/`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCanteenFoodMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
