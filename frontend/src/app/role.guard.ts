// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Check if user role is allowed for this route
      const roles = route.data['roles'] as Array<string>;
      if (roles && roles.includes(currentUser.role)) {
        return true;
      }
    }

    // Redirect to login if not authorized
    this.router.navigate(['/unauth']);
    return false;
  }
}
