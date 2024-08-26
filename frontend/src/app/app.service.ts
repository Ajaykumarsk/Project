import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from './User';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user, { headers: this.getHeaders() });
  }

  getAllUsers(
    page: number = 1, 
    pageSize: number = 10, 
    searchQuery: { [key: string]: string } = {}, 
    filters: any = {}
  ): Observable<{ results: User[], count?: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
  
    // Add search parameters if they are provided
    Object.keys(searchQuery).forEach(key => {
      params = params.set(key, searchQuery[key]);
    });
  
    // Add filter parameters if they are provided
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
  
    return this.http.get<{ results: User[], count?: number }>(`${this.apiUrl}/user/`, {
      params: params
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`, { headers: this.getHeaders() });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  logout(): void {
    localStorage.removeItem('token');
    // Additional logout logic can go here
    localStorage.removeItem('name');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
    } else {
      return new HttpHeaders();
    }
  }
  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }
  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user details:', error);
        return throwError('Failed to fetch user details. Please try again.');
      })
    );
  }
  
}