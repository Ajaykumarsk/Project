import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const host = window.location.host;
      if (host.includes('localhost')) {
        this.apiUrl = 'http://localhost:8000/api';
      } else {
        this.apiUrl = 'http://172.20.10.2:8000/api';
      }
    } else {
      // Provide a fallback value or handle the non-browser scenario
      this.apiUrl = environment.apiUrl || 'http://localhost:8000/api';
    }
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
