import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {

    const formdata: FormData = new FormData();

    formdata.append('username', username);
    formdata.append('password', password);

    console.log("sending request...");
    return this.http.post<any>(this.apiUrl + '/user/login', formdata);
  }

  logout(userId: number): Observable<any> {

    const formdata: FormData = new FormData();

    formdata.append('userId', `${userId}`);

    console.log("sending request...");
    return this.http.post<any>(this.apiUrl + '/user/logout', formdata);
  }

  register(username: string, password: string): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('username', username);
    formdata.append('password', password);

    console.log("sending request...");
    return this.http.post<any>(this.apiUrl + '/user', formdata);
  }

  /* GET users whose username contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.apiUrl}/users?username=${term}`).pipe(
      tap(_ => console.log(`found users matching "${term}"`)),
      catchError(error => {
        console.log(error);

        // Let the app keep running by returning an empty result.
        return of([]);
      })
    );
  }
}
