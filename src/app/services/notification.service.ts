import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Notification } from '../models/notification';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }  

  markAsRead(notificationId: number): Observable<Notification> {
    const formdata: FormData = new FormData();

    formdata.append('id', `${notificationId}`);

    //const req = new HttpRequest('PUT', this.apiUrl + '/notification', formdata, {});

    return this.http.put<Notification>(this.apiUrl + '/notification', formdata, {});
  }

  /** GET the notifications from the server */
  getNotifications(): Observable<any> {

    return this.http.get<Notification[]>(`${this.apiUrl}/notification`);
  }

}