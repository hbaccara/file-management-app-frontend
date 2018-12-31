import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../services/file.service';
import { File } from "../../models/file";
import { AuthService } from '../../services/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-folder-creation-form',
  templateUrl: './folder-creation-form.component.html',
  styleUrls: ['./folder-creation-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FolderCreationFormComponent implements OnInit {

  @ViewChild('content') content;

  folderName: string = '';
  currentDirectoryId: number;
  modal: NgbModalRef;

  @Input() files: File[];

  constructor(private modalService: NgbModal,
    private fileService: FileService,
    private authService: AuthService,
    private notifierService: NotifierService) { }

  ngOnInit() {
  }

  showForm(currentDirectoryId: number): void {
    this.currentDirectoryId = currentDirectoryId;
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeForm(): void{
    this.modal.close();

    // clear the name input
    this.folderName = '';
  }

  createFolder(): void {

    if (!this.folderName) return;

    this.fileService.createFolder(this.authService.userId, this.currentDirectoryId, this.folderName)
      .subscribe(folder => {

        // add the folder to the directory
        this.files = this.files || [];
        this.files.unshift(folder);

        this.closeForm();
        this.notifierService.notify('success', 'Folder created!');
        
      }, (err) => {
        this.notifierService.notify('error', 'An error occured while creating the folder!');
      });
  }

}
