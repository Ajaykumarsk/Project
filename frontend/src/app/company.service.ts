import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Company } from './company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }
  // Fetch all companys
  getcompanys(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companys/`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Fetch a Company by ID
  getCompanyById(id: number): Observable<Company> {
    const url = `${this.apiUrl}/companys/${id}/`;
    return this.http.get<Company>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add a new Company
  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/companys/`, company, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing Company
  updateCompany(id: number, company: Company): Observable<Company> {
    const url = `${this.apiUrl}/companys/${id}/`;
    return this.http.put<Company>(url, company, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a Company by ID
  deleteCompany(id: number): Observable<any> {
    const url = `${this.apiUrl}/companys/${id}/`;
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
