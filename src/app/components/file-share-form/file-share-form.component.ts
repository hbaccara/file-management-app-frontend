import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { File } from "../../models/file";
import { User } from "../../models/user";
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { NotifierService } from 'angular-notifier';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-file-share-form',
  templateUrl: './file-share-form.component.html',
  styleUrls: ['./file-share-form.component.css'],
  providers: [NgbDropdownConfig]
})
export class FileShareFormComponent implements OnInit {

  @ViewChild('content') content;

  modal: NgbModalRef;
  file: File;
  users$: Observable<User[]>;
  private searchTerms = new Subject<string>();
  selectedUser: User;

  constructor(private modalService: NgbModal,
    private authService: AuthService,
    private userService: UserService,
    private rxStompService: RxStompService, 
    private notifierService: NotifierService,
    ngbDropdownconfig: NgbDropdownConfig) { 

      ngbDropdownconfig.autoClose = false;
    }

  ngOnInit() {
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term)),
    );
  }

  showForm(file: File): void{
    this.file = file;
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeForm(): void{
    this.modal.close();
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectUser(user: User){
    this.selectedUser = user;
  }

  sendFileShareRequest(message) {
    this.rxStompService.publish({ destination: '/app/share', body: JSON.stringify(message) });
  }

  share() {

    if (!this.selectedUser) return;

    console.log("sharing item: " + this.file.name);
    
    let shareRequest = {
      userId: this.authService.userId,
      fileId: this.file.id,
      userToShareWithId: this.selectedUser.id
    }
    this.sendFileShareRequest(shareRequest);
    
    this.closeForm();
    this.notifierService.notify('success', 'Item shared!');
  }
}
