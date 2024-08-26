import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Visitor } from './visitor';
import { saveAs } from 'file-saver';
import { UserService } from './app.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private apiUrl: string;

  private newVisitorsSubject = new BehaviorSubject<number>(0);
  newVisitors$ = this.newVisitorsSubject.asObservable();

  private approvedVisitorsSubject = new BehaviorSubject<number>(0);
  approvedVisitors$ = this.approvedVisitorsSubject.asObservable();

   // Chairman Notifications
  private chairmanNotificationsSubject = new BehaviorSubject<number>(0);
  chairmanNotifications$ = this.chairmanNotificationsSubject.asObservable();

  incrementNewVisitors() {
    
    this.newVisitorsSubject.next(this.newVisitorsSubject.value + 1);
}

resetNewVisitors() {
    
    this.newVisitorsSubject.next(0);
}
// Increment approved visitor count
  incrementApprovedVisitors() {
    this.approvedVisitorsSubject.next(this.approvedVisitorsSubject.value + 1);
  }

  // Reset approved visitor count
  resetApprovedVisitors() {
    this.approvedVisitorsSubject.next(0);
  }
  
   // Chairman Methods
   incrementChairmanNotifications() {
    this.chairmanNotificationsSubject.next(this.chairmanNotificationsSubject.value + 1);
  }

  resetChairmanNotifications() {
    this.chairmanNotificationsSubject.next(0);
  }
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  
  getRecentVisitors(): Observable<Visitor[]> {
    return this.getVisitors().pipe(
      map(visitors => {
        const now = new Date();
        return visitors.filter(visitor => {
          // Check if check_in_time is defined before using it
          if (visitor.check_in_time) {
            return (now.getTime() - new Date(visitor.check_in_time).getTime()) < 24 * 60 * 60 * 1000;
          }
          return false; // or true, depending on your logic
        });
      })
    );
  }
  

  getVisitors(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(`${this.apiUrl}/visitors/`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log()), // Log the response
        catchError(this.handleError)
      );
  }

  addVisitor(visitorData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/visitors/`, visitorData, { headers: this.getHeaders() })
        .pipe(
            tap((response) => {
                console.log('Visitor added successfully:', response); // Log the full response object
                
               

                if (response.select_employee === 'Chairman') {
                  console.log('Chairman selected, incrementing chairman notifications.');
                  this.incrementChairmanNotifications();
                } else {
                  // Increment the new visitors count for employees other than the chairman
                  this.incrementNewVisitors();
                }
            }),
            catchError(this.handleError)
        );
}



  searchVisitor(searchValue: string): Observable<Visitor> {
    const queryParams = `?search=${searchValue}`;
    return this.http.get<Visitor>(`${this.apiUrl}/visitors/search/${queryParams}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getVisitorByPassNo(visitor_pass_no: string): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/visitors/?visitor_pass_no=${visitor_pass_no}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getVisitor(id: number): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/visitors/${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateVisitor(id: number, visitorData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/visitors/${id}/`, visitorData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteVisitor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/visitors/${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getVisitorHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/visitors/history`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  exportVisitors(startDate: string, endDate: string): Observable<Blob> {
    let params = new HttpParams();
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);

    return this.http.get(`${this.apiUrl}/visitors/export`, {
      responseType: 'blob',
      params: params
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error exporting visitors');
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    
    // Check if the error is an instance of HttpErrorResponse
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error) {
        // Extract specific error messages from the response
        errorMessage = 'Invalid Form Details:<br>';
        for (const [field, messages] of Object.entries(error.error)) {
          errorMessage += `${field}: ${(messages as string[]).join(' ')}<br>`;
        }
      } else {
        errorMessage = `Server-side error: ${error.message}`;
      }
    }
  
    console.error('An error occurred:', errorMessage);
    
    // Return a user-friendly message
    return throwError(errorMessage);
  }
  getNextVisitorPassNo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/next-visitor-pass/`);
  }

   // BehaviorSubject to track front office notifications
   private frontOfficeNotifications = new BehaviorSubject<number>(0);
   frontOfficeNotifications$ = this.frontOfficeNotifications.asObservable();
 
   // Method to reset front office notifications count
   resetFrontOfficeNotifications() {
     this.frontOfficeNotifications.next(0);
   }
   private approveAdminNotificationsSource = new BehaviorSubject<Visitor[]>([]);
   approveAdminNotifications$ = this.approveAdminNotificationsSource.asObservable();
 
   resetApproveAdminNotifications(): void {
    this.approveAdminNotificationsSource.next([]);
  }
}
