import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const AUTH_TOKEN_COOKIE = 'authTokenCookie';
const USER_ID_COOKIE = 'userIdCookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  userId: number;
  authToken: string;

  private isLoggedInSubject = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private cookieService: CookieService, private http: HttpClient) {

    if ((!this.authToken || !this.userId) && this.cookieService.check(AUTH_TOKEN_COOKIE)
      && this.cookieService.check(USER_ID_COOKIE)) {
      // get the user ID and the authorization token from the session cookies
      this.authToken = this.cookieService.get(AUTH_TOKEN_COOKIE);
      this.userId = +this.cookieService.get(USER_ID_COOKIE);
      this.isLoggedInSubject.next(true);
    }
  }

  setLoggedIn(userId: number, authToken: string): void {

    this.userId = userId;
    this.authToken = authToken;
    this.cookieService.set(USER_ID_COOKIE, `${userId}`);
    this.cookieService.set(AUTH_TOKEN_COOKIE, `${authToken}`);
    this.isLoggedInSubject.next(true);
  }

  setLoggedOut(): void {

    this.userId = undefined;
    this.authToken = undefined;
    this.cookieService.delete(USER_ID_COOKIE);
    this.cookieService.delete(AUTH_TOKEN_COOKIE);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.userId && !!this.authToken;
  }

  login(username: string, password: string): Observable<any> {

    const formdata: FormData = new FormData();

    formdata.append('username', username);
    formdata.append('password', password);

    return this.http.post<any>(this.apiUrl + '/user/login', formdata);
  }

  logout(): Observable<any> {

    return this.http.put<any>(this.apiUrl + '/user/logout', {});
  }

}