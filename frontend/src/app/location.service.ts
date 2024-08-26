import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location } from './User';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }
  // Fetch all locations
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a location by ID
  getLocationById(id: number): Observable<Location> {
    const url = `${this.apiUrl}/locations/${id}/`;
    return this.http.get<Location>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new location
  addLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/locations/`, location, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing location
  updateLocation(id: number, location: Location): Observable<Location> {
    const url = `${this.apiUrl}/locations/${id}/`;
    return this.http.put<Location>(url, location, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a location by ID
  deleteLocation(id: number): Observable<any> {
    const url = `${this.apiUrl}/locations/${id}/`;
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
