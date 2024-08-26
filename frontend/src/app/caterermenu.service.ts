import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatererMenuService {
  private apiUrl = 'http://localhost:8000/api/caterer-menus/';  // Update with your API URL

  constructor(private http: HttpClient) { }

  getCatererMenus(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createCatererMenu(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCatererMenu(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  deleteCatererMenu(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
