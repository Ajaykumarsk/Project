import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl: string;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isBrowser: boolean;

  constructor(private http: HttpClient, private configService: ConfigService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Initialize BehaviorSubject based on browser environment
    const currentUser = this.isBrowser ? JSON.parse(localStorage.getItem('currentUser') || '{}') : {};
    this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
    this.loginUrl = `${this.configService.getApiUrl()}/login/`;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public getUserRole(): string {
    const user = this.currentUserValue;
    return user ? user.role : '';
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password })
      .pipe(map(user => {
        if (this.isBrowser) {
          // Store user details and JWT token in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        console.log(this.currentUserSubject);
        return user;
      }));
  }

  logout(): void {
    if (this.isBrowser) {
      // Remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}
