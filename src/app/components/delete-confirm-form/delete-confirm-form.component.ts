import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../services/file.service';
import { File } from "../../models/file";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-delete-confirm-form',
  templateUrl: './delete-confirm-form.component.html',
  styleUrls: ['./delete-confirm-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteConfirmFormComponent implements OnInit {

  @ViewChild('content') content;

  modal: NgbModalRef;
  file: File;

  @Input() files: File[];
  @Output() itemDeleted = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal, 
    private fileService: FileService, 
    private notifierService: NotifierService) { }

  ngOnInit() {
  }

  showForm(file: File): void{
    this.file = file;
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeForm(): void{
    this.modal.close();
  }

  delete(): void {
    this.fileService.deleteDirectoryItem(this.file)
      .subscribe(() => {
        
        // remove the item from the directory
        let fileIndex = this.files.findIndex(x => x === this.file);
        this.files.splice(fileIndex, 1);

        // notify the parent component that the selected item has been deleted
        this.itemDeleted.emit();
        
        this.closeForm();
        this.notifierService.notify( 'success', 'Item deleted!' );
      }, (err) => {
        this.notifierService.notify('error', 'An error occured while attempting to delete the file!');
      });
  }

}
