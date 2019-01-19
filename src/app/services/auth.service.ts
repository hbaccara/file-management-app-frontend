import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

const SESSION_COOKIE_NAME = 'sessionCookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  userId: number;

  private isLoggedInSubject = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private cookieService: CookieService) {

    if (!this.userId && this.cookieService.check(SESSION_COOKIE_NAME)) {
      // get the user ID from the session cookie
      this.userId = +this.cookieService.get(SESSION_COOKIE_NAME);
      this.isLoggedInSubject.next(true);
    }
  }

  setLoggedIn(userId: number): void {

    this.userId = userId;
    this.cookieService.set(SESSION_COOKIE_NAME, `${userId}`);
    this.isLoggedInSubject.next(true);
  }

  setLoggedOut(): void {

    this.userId = undefined;
    this.cookieService.delete(SESSION_COOKIE_NAME);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.userId;
  }

}