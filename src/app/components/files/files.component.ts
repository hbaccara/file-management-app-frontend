import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from "../../models/file";
import { FileUploadFormComponent } from '../file-upload-form/file-upload-form.component';
import { FolderCreationFormComponent } from '../folder-creation-form/folder-creation-form.component';
import { RenameFormComponent } from '../rename-form/rename-form.component';
import { DeleteConfirmFormComponent } from '../delete-confirm-form/delete-confirm-form.component';
import { FileShareFormComponent } from '../file-share-form/file-share-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FILE_EXTENSIONS } from '../../constants/file-extensions';
import { AuthService } from '../../services/auth.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ])
  ]
})
export class FilesComponent implements OnInit {

  @ViewChild(FolderCreationFormComponent) folderCreationFormComponent: FolderCreationFormComponent;
  @ViewChild(FileUploadFormComponent) fileUploadFormComponent: FileUploadFormComponent;
  @ViewChild(RenameFormComponent) renameFormComponent: RenameFormComponent;
  @ViewChild(DeleteConfirmFormComponent) deleteConfirmFormComponent: DeleteConfirmFormComponent;
  @ViewChild(FileShareFormComponent) fileShareFormComponent: FileShareFormComponent;

  files: File[];
  currentDirectoryId: number;
  selectedFile: File;
  hierarchy: File[];

  loadingData: boolean = false;
  dataLoadingFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private authService: AuthService,
    private rxStompService: RxStompService,
    private notifierService: NotifierService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.currentDirectoryId = id ? id : -1;
    this.getFiles();
  }

  share() {
    this.fileShareFormComponent.showForm(this.selectedFile);
  }

  getFiles(): void {

    this.loadingData = true;

    this.fileService.getFiles(this.authService.userId, this.currentDirectoryId)
      .subscribe(response => {

        this.files = response.files
          .sort((i1, i2) => (i1.name < i2.name ? -1 : 1))
          .sort((i1, i2) => {
            if (i1.isFolder && !i2.isFolder) return -1;
            else if (!i1.isFolder && i2.isFolder) return 1;
            else return 0;
          });

        this.hierarchy = response.hierarchy;

        this.loadingData = false;
        this.dataLoadingFailed = false;
        
      }, err => {
          console.log("Data loading failed!");
          this.loadingData = false;
          this.dataLoadingFailed = true;
        });
  }

  download(): void {
    this.fileService.download(this.selectedFile.id);
  }

  openOrDownload(file: File): void {
    if (!file.isFolder) {
      // download the file
      this.fileService.download(file.id);
    }
    else {
      // open the folder
      this.router.navigate(['directory', file.id]);
    }
  }

  select(file: File): void {
    this.selectedFile = file;
  }

  delete(): void {
    this.deleteConfirmFormComponent.showForm(this.selectedFile);
  }

  onItemDeleted(): void {
    this.selectedFile = null;
  }

  createNewFolder(): void {
    this.folderCreationFormComponent.showForm(this.currentDirectoryId);
  }

  uploadFile(): void {
    this.fileUploadFormComponent.showForm(this.currentDirectoryId);
  }

  rename(): void {
    this.renameFormComponent.showForm(this.selectedFile);
  }

  isHierarchyEmpty(): boolean {
    return !(!!this.hierarchy && this.hierarchy.length > 0);
  }

  getIconUri(file: File): string {

    if (file) {
      let type;
      if (!file.isFolder) {
        let lastDotPosition = file.name.lastIndexOf(".");
        if (lastDotPosition > 0 && lastDotPosition != file.name.length - 1) {
          let fileExtension = file.name.substring(lastDotPosition + 1);
          if (!FILE_EXTENSIONS.find(x => x === fileExtension)) {
            type = "file";
          }
          else {
            type = fileExtension;
          }
        }
        else {
          type = "file";
        }
      }
      else {
        type = "folder";
      }

      return `../../assets/file-icons/${type}.png`;
    }
  }
}
