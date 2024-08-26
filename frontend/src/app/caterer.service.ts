import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Caterer } from './caterer';

@Injectable({
  providedIn: 'root'
})
export class CatererService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  // Fetch all caterers
  getCaterers(): Observable<Caterer[]> {
    return this.http.get<Caterer[]>(`${this.apiUrl}/caterer/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a caterer by ID
  getCatererById(id: number): Observable<Caterer> {
    const url = `${this.apiUrl}/caterer/${id}/`;
    return this.http.get<Caterer>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addCaterer(caterer: Caterer): Observable<Caterer> {
    return this.http.post<Caterer>(`${this.apiUrl}/caterer/`, caterer).pipe(
      catchError(error => {
        console.error('Error adding caterer:', error);
        return throwError(() => new Error('Error adding caterer'));
      })
    );
  }
  // Update an existing caterer
  updateCaterer(id: number, caterer: Caterer): Observable<Caterer> {
    const url = `${this.apiUrl}/caterer/${id}/`;
    return this.http.put<Caterer>(url, caterer, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a caterer by ID
  deleteCaterer(id: number): Observable<any> {
    const url = `${this.apiUrl}/caterer/${id}/`;
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
