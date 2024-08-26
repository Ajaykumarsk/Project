// is-browser.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IsBrowserService {
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
