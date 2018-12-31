import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'
import { Notification } from '../../models/notification';
import { FileShareNotification } from '../../models/file-share-notification';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../enums/notification-type.enum';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css', './app-header.component.notifications.css'],
  providers: [NgbDropdownConfig]
})
export class AppHeaderComponent implements OnInit {

  notificationType = NotificationType;
  notifications: Notification[];
  private wsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private router: Router,
    private rxStompService: RxStompService,
    ngbDropdownconfig: NgbDropdownConfig) {

    ngbDropdownconfig.placement = 'bottom-right';
  }

  ngOnInit() {

    if (this.authService.isLoggedIn()) {
      this.getNotifications();
      this.watchNotifications();
    }
    else {
      this.authService.isLoggedIn$.subscribe(
        isLoggedIn => {
          if (isLoggedIn) {
            this.getNotifications();
            this.watchNotifications();
          }
        });
    }
  }

  ngOnDestroy() {
    this.wsSubscription.unsubscribe();
  }

  logout(): void {
    this.userService.logout(this.authService.userId).subscribe(() => {

      this.authService.setLoggedOut();
      this.router.navigate(['login']);

    });
  }

  getNotifications(): void {

    this.notificationService.getNotifications(this.authService.userId)
      .subscribe(data => this.notifications = data);
  }

  watchNotifications(): void {
    this.wsSubscription = this.rxStompService.watch(`/user/${this.authService.userId}/shared`)
      .subscribe((message: Message) => {
        console.log(`received message: ${message.body}`);
        this.notifications = this.notifications || [];
        this.notifications.unshift(JSON.parse(message.body));
      });
  }

  getNumberOfUnreadNotifications(): number {

    let unread = 0;

    if (this.notifications) {
      this.notifications.forEach(n => {
        unread += n.isRead ? 0 : 1
      });
    }

    return unread;
  }

  markNotificationAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).subscribe(notification_ => {

      // override the item with the instance returned by the server
      Object.assign(notification, notification_);
    });
  }

  getNotificationTitle(notification: Notification): string {

    let notificationTitle = '';

    if (notification.type == NotificationType[NotificationType.FILE_SHARED]) {
      let fileShareNotification = notification as FileShareNotification;
      notificationTitle += fileShareNotification.sharer + ' shared the following ' +
        (fileShareNotification.isFolder ? 'folder' : 'file') +
        ' with you';
    }
    return notificationTitle;
  }

  downloadFileOrOpenFolder(notification: Notification): void {

    if (notification.type == NotificationType[NotificationType.FILE_SHARED]) {
      let fileShareNotification = notification as FileShareNotification;

      if (!fileShareNotification.isFolder) {
        // download the file
        this.fileService.download(fileShareNotification.fileId);
      }
      else {
        // open the folder
        this.router.navigate(['directory', fileShareNotification.fileId]);
      }

    }
  }
}
