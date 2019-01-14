export class FileUpload {
    file: File;
    filename: string;
    children: FileUpload[];
    isFolder: boolean;

    constructor(file: File, filename: string, children: FileUpload[], isFolder: boolean) {
      this.file = file;
      this.filename = filename;
      this.children = children;
      this.isFolder = isFolder;
    }
  }