
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Circular } from './circular';

@Injectable({
  providedIn: 'root'
})
export class CircularService {
  private apiUrl = 'http://localhost:8000/api/circular/';  // Adjust the URL to match your Django backend endpoint

  constructor(private http: HttpClient) {}

  // Get all circulars
  getCirculars(): Observable<Circular[]> {
    return this.http.get<Circular[]>(this.apiUrl);
  }

  // Get a single circular by ID
  getCircular(id: number): Observable<Circular> {
    return this.http.get<Circular>(`${this.apiUrl}${id}/`);
  }

  // Add a new circular
  addCircular(circularData: FormData): Observable<Circular> {
    return this.http.post<Circular>(this.apiUrl, circularData);
  }

  // Update an existing circular
  updateCircular(id: number, circularData: FormData): Observable<Circular> {
    return this.http.put<Circular>(`${this.apiUrl}${id}/`, circularData);
  }

  // Delete a circular by ID
  deleteCircular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}


export { Circular };

