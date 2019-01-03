import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { File } from "../../models/file";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-rename-form',
  templateUrl: './rename-form.component.html',
  styleUrls: ['./rename-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RenameFormComponent implements OnInit {

  @ViewChild('content') content;

  newName: string = '';
  file: File;
  modal: NgbModalRef;

  constructor(private modalService: NgbModal,
    private fileService: FileService,
    private notifierService: NotifierService) { }

  ngOnInit() {
  }

  showForm(file: File): void {
    this.newName = this.getEditableName(file);
    this.file = file;
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeForm(): void{
    this.modal.close();

    // clear the new name input
    this.newName = '';
  }

  private getEditableName(file: File): string {

    if (file.isFolder) {
      return file.name;
    }
    else {
      let lastDotPosition = file.name.lastIndexOf(".");
      if (lastDotPosition > 0) {
        return file.name.substring(0, lastDotPosition);
      }
      else {
        return file.name;
      }
    }
  }

  private getExtension(file: File): string {

    if (file.isFolder) {
      return null;
    }
    else {
      let lastDotPosition = file.name.lastIndexOf(".");
      if (lastDotPosition > 0 && lastDotPosition != file.name.length - 1) {
        return file.name.substring(lastDotPosition + 1);
      }
      else {
        return null;
      }
    }
  }

  rename(): void {

    if (!this.newName) return;

    let extension = this.getExtension(this.file);
    let newName = this.newName + (extension != null ? "." + extension : "");
    this.fileService.rename(this.file.id, newName)
      .subscribe((file) => {

        // override the item with the instance returned by the server
        Object.assign(this.file, file);

        this.closeForm();
        this.notifierService.notify('success', 'Item renamed!');

      }, (err) => {
        this.notifierService.notify('error', 'An error occured while renaming the item!');
      });
  }
}
