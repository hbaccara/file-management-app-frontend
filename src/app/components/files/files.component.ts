import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from "../../models/file";
import { BlobFile } from "src/app/models/blob-file";
import { FileUpload } from "../../models/file-upload";
import { FileUploadFormComponent } from '../file-upload-form/file-upload-form.component';
import { FolderCreationFormComponent } from '../folder-creation-form/folder-creation-form.component';
import { RenameFormComponent } from '../rename-form/rename-form.component';
import { DeleteConfirmFormComponent } from '../delete-confirm-form/delete-confirm-form.component';
import { FileShareFormComponent } from '../file-share-form/file-share-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FILE_EXTENSIONS } from '../../constants/file-extensions';
import { FileSearchService } from 'src/app/services/file-search.service';
import { NotifierService } from 'angular-notifier';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

const FILE_TO_MOVE_ID_DATA_KEY = "fileToMoveId";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(700)),
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
  isSearchPage: boolean = false;
  isSharedWithMePage: boolean = false;
  draggedOverFolder: File;
  tableIsDraggedOver: boolean = false;
  uploadProgress: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private fileSearchService: FileSearchService,
    private notifierService: NotifierService,
    private authService: AuthService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    if (this.router.url.indexOf("home") > -1) {
      this.currentDirectoryId = -1;
      this.getFiles();
    }
    else if (this.router.url.indexOf("directory") > -1) {
      this.currentDirectoryId = +this.route.snapshot.paramMap.get('id');
      this.getFiles();
    }
    else if (this.router.url.indexOf("search") > -1) {
      const searchTerm = this.route.snapshot.queryParamMap.get('q');
      this.searchFiles(searchTerm);
      this.isSearchPage = true;
    }
    else if (this.router.url.indexOf("shared-with-me") > -1) {
      this.getFilesSharedWithUser();
      this.isSharedWithMePage = true;
    }

    if (!this.isSearchPage) {
      this.fileSearchService.clearSearchTerm();
    }
  }

  getFiles(): void {

    this.loadingData = true;

    this.fileService.getFiles(this.currentDirectoryId)
      .subscribe(response => {

        this.files = this.sortFiles(response.files);

        this.hierarchy = response.hierarchy;

        this.loadingData = false;
        this.dataLoadingFailed = false;

      }, err => {
        console.log("Data loading failed!");
        this.loadingData = false;
        this.dataLoadingFailed = true;
      });
  }

  searchFiles(searchTerm: string): void {

    this.loadingData = true;

    this.fileService.searchFiles(searchTerm)
      .subscribe(files => {

        this.files = this.sortFiles(files);

        this.loadingData = false;
        this.dataLoadingFailed = false;

      }, err => {
        console.log("Data loading failed!");
        this.loadingData = false;
        this.dataLoadingFailed = true;
      });
  }

  getFilesSharedWithUser(): void {

    this.loadingData = true;

    this.fileService.getFilesSharedWithUser()
      .subscribe(files => {

        this.files = this.sortFiles(files);

        this.loadingData = false;
        this.dataLoadingFailed = false;

      }, err => {
        console.log("Data loading failed!");
        this.loadingData = false;
        this.dataLoadingFailed = true;
      });
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

  share() {
    this.fileShareFormComponent.showForm(this.selectedFile);
  }

  delete(): void {
    this.deleteConfirmFormComponent.showForm(this.selectedFile);
  }

  select(file: File): void {
    this.selectedFile = file;
  }

  openOrDownload(file: File): void {
    if (file.isFolder) {
      // open the folder
      this.router.navigate(['directory', file.id]);
    }
    else {
      // download the file
      this.fileService.download(file.id);
    }
  }

  download(): void {
    this.fileService.download(this.selectedFile.id);
  }

  move(file: File, newParentId: number): void {

    this.fileService.move(file.id, newParentId)
      .subscribe((resp) => {

        // remove the item from the current directory
        let fileIndex = this.files.findIndex(x => x === file);
        this.files.splice(fileIndex, 1);

        this.notifierService.notify('success', 'Item moved!');

      }, (err) => {
        this.notifierService.notify('error', 'An error occured while moving the item!');
      });
  }

  onItemDeleted(): void {
    this.selectedFile = null;
  }

  isHierarchyEmpty(): boolean {
    return !(!!this.hierarchy && this.hierarchy.length > 0);
  }

  private sortFiles(files: File[]): File[] {
    return files
      .sort((i1, i2) => (i1.name < i2.name ? -1 : 1))
      .sort((i1, i2) => {
        if (i1.isFolder && !i2.isFolder) return -1;
        else if (!i1.isFolder && i2.isFolder) return 1;
        else return 0;
      });
  }

  getIconUri(file: File): string {

    if (file) {
      let type;
      if (file.isFolder) {
        type = "folder";
      }
      else {
        type = "file";

        let lastDotPosition = file.name.lastIndexOf(".");
        if (lastDotPosition > 0 && lastDotPosition != file.name.length - 1) {
          let fileExtension = file.name.substring(lastDotPosition + 1);
          if (FILE_EXTENSIONS.find(x => x === fileExtension)) {
            type = fileExtension;
          }
        }
      }
      return `../../assets/file-icons/${type}.png`;
    }
  }

  onDragStart(event: any, file: File) {
    console.log('started onDragStart()');
    event.dataTransfer.setData(FILE_TO_MOVE_ID_DATA_KEY, file.id);
  }

  onDragOver(event: any, file: File): void {
    event.preventDefault();
    console.log('started onDragOver()');
    if (file && file.isFolder) {
      this.draggedOverFolder = file;
    }
    else {
      this.tableIsDraggedOver = true;
    }
    event.stopPropagation();
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    console.log('dragleave tr');
    this.draggedOverFolder = undefined;
    this.tableIsDraggedOver = false;
  }

  onDrop(ev: any, file: File): void {
    ev.preventDefault();
    console.log('started onDrop()');
    this.draggedOverFolder = undefined;
    this.tableIsDraggedOver = false;

    var fileToMoveId = ev.dataTransfer.getData(FILE_TO_MOVE_ID_DATA_KEY);
    console.log(`fileToMoveId: ${fileToMoveId}`);
    if (fileToMoveId && file && file.isFolder && file.id != fileToMoveId) {
      console.log(`transferring file ${fileToMoveId} to ${file.id}...`);
      let fileToMove = this.files.find(f => f.id == fileToMoveId);
      this.move(fileToMove, file.id);
    }
    else {
      var items = ev.dataTransfer.items;

      if (items) {

        // If dropped items aren't files, reject them
        for (var i = 0; i < items.length; i++) {
          if (items[i].kind !== 'file') {
            return;
          }
        }

        this.getFilesFromDataTransferItems(items)
          .then(data => {
            console.log('number of files: ' + data.fileCount);
            console.log('files: ');
            console.log(data.files);
            
            this.uploadProgress = 0;

            this.notifierService.getConfig().position.horizontal.position = 'right';
            this.notifierService.getConfig().behaviour.showDismissButton = false;
            this.notifierService.notify('default', 'Uploading files...', 'FILES_UPLOAD_NOTIFICATION_ID');

            let directoryId = file && file.isFolder ? file.id : this.currentDirectoryId;
            this.uploadFiles(data.files, directoryId)
            .then(() => {
              console.log('upload successfull');

              this.notifierService.hide( 'FILES_UPLOAD_NOTIFICATION_ID' );
              this.notifierService.getConfig().behaviour.showDismissButton = true;
              this.notifierService.getConfig().position.horizontal.position = 'left';
              
              this.notifierService.notify('success', 'File(s) uploaded successfully!');
            })
          })
      }
    }
    event.stopPropagation();
  }

  async uploadFiles(files: FileUpload[], directoryId: number) {

    const uploadFile = (file: Blob, directoryId: number) => {
      return new Promise((resolve, reject) => {
        this.fileService.uploadFile(directoryId, file)
          .subscribe(event => {

            if (event.type === HttpEventType.UploadProgress) {
              let percentage = Math.round(100 * event.loaded / event.total);
              console.log('file upload percentage: ' + percentage);
            } else if (event instanceof HttpResponse) {

              if (directoryId == this.currentDirectoryId) {
                // add the file to the directory
                this.files = this.files || [];
                this.files.unshift(JSON.parse(event.body));
              }

              resolve();
            }
          }, (err) => {
            reject();
          });
      })
    }

    const createFolder = (folderName) => {
      return new Promise((resolve, reject) => {
        this.fileService.createFolder(directoryId, folderName)
          .subscribe(folder => {

            if (directoryId == this.currentDirectoryId) {
              // add the folder to the current directory
              this.files = this.files || [];
              this.files.unshift(folder);
            }

            resolve(folder.id);

          }, (err) => {
            reject();
          });
      })
    }

    for await (let file of files) {

      if (file.isFolder) {
        const folderId = await createFolder(file.filename) as number;
        await this.uploadFiles(file.children, folderId);
      }
      else {
        await uploadFile(file.file, directoryId);
        this.uploadProgress++;
        console.log('uploadProgress: ' + this.uploadProgress);
      }
    }
  }

  async getFilesFromDataTransferItems(dataTransferItems) {

    const readFile = (entry, path = '') => {
      return new Promise((resolve, reject) => {
        entry.file(file => {
          resolve(file);
        }, reject)
      })
    }

    const dirReadEntries = (dirReader, parentList, path) => {
      return new Promise((resolve, reject) => {
        dirReader.readEntries(async entries => {
          let fileCount = 0;
          for (let entry of entries) {
            fileCount += await getFilesFromEntry(entry, parentList, path);
          }
          resolve(fileCount);
        }, reject)
      })
    }

    const readDir = async (entry, parentList, path) => {
      const dirReader = entry.createReader();
      const newPath = path + entry.name + '/';
      let fileCount = 0;
      let readEntries;
      do {
        readEntries = await dirReadEntries(dirReader, parentList, newPath);
        fileCount = fileCount + readEntries;
      } while (readEntries > 0);
      return fileCount;
    }

    const getFilesFromEntry = async (entry, parentList, path = '') => {
      if (entry.isFile) {
        const file = await readFile(entry, path) as BlobFile;
        let f = new FileUpload(file, file.name, null, false);
        parentList.push(f);
        console.log(f);
        return 1;
      }
      else if (entry.isDirectory) {
        let f = new FileUpload(null, entry.name, [], true);
        parentList.push(f);
        let fileCount = await readDir(entry, f.children, path);
        return fileCount;
      }
      // throw new Error('Entry not isFile and not isDirectory - unable to get files')
    }

    let files = [];

    let fileCountPromises = [];
    for (let item of dataTransferItems) {
      const entry = item.webkitGetAsEntry();
      fileCountPromises.push(getFilesFromEntry(entry, files));
    }
    const fileCounts = await Promise.all(fileCountPromises);
    const fileCount = fileCounts.reduce((previousValue, currentValue) => previousValue + currentValue);

    return { fileCount: fileCount, files: files };
  }
}
