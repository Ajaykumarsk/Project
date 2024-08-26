// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private visitorRefreshSubject = new BehaviorSubject<void>(undefined);

  visitorRefresh$ = this.visitorRefreshSubject.asObservable();

  triggerRefresh() {
    console.log('SharedService: Refresh triggered');
    this.visitorRefreshSubject.next();
  }
}
