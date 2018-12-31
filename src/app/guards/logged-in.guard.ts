import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {


  constructor(private router: Router, 
    private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isLoggedIn()) { 
      // Navigate to the home page
      this.router.navigate(['/home'], {replaceUrl: true});
      return false; 
    }
    return true;
  }
}
