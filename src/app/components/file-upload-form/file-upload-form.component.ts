import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { File } from '../../models/file';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FileUploadFormComponent implements OnInit {

  @ViewChild('content') content;

  currentDirectoryId: number;
  modal: NgbModalRef;
  selectedFiles: FileList;
  currentFileUpload: Blob;
  progress: { percentage: number } = { percentage: 0 };

  @Input() files: File[];

  constructor(private modalService: NgbModal,
    private fileService: FileService,
    private notifierService: NotifierService) { }

  ngOnInit() {
  }

  showForm(currentDirectoryId: number): void {
    this.currentDirectoryId = currentDirectoryId;
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeForm(): void{
    this.modal.close();
    this.currentFileUpload = null; 
    this.selectedFiles = null; 
    this.progress.percentage = 0
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {

    if (!(this.selectedFiles && this.selectedFiles.length > 0)) return;

    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);

    this.fileService.uploadFile(this.currentDirectoryId, this.currentFileUpload)
      .subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {

          // reset the component members
          this.progress.percentage = 0;
          this.currentFileUpload = undefined;
          this.selectedFiles = undefined;

          // add the file to the directory
          this.files = this.files || [];
          this.files.unshift(JSON.parse(event.body));

          this.closeForm();
          this.notifierService.notify('success', 'File uploaded!');
        }
      }, (err) => {
        // reset the percentage bar
        this.progress.percentage = 0;

        this.notifierService.notify('error', 'An error occured while uploading the file!');
      });
  }

}
