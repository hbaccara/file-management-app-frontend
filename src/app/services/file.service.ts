import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { File } from '../models/file';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }  

  uploadFile(userId: number, parentId: number, file: Blob): Observable<HttpEvent<any>> {
    const formdata: FormData = new FormData();

    formdata.append('userId', `${userId}`);
    formdata.append('parentId', `${parentId}`);
    formdata.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl + '/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  /** GET directory items from the server */
  getFiles(userId: number, directoryId: number): Observable<any> {

    return this.http.get<File[]>(`${this.apiUrl}/directory/${directoryId}?userId=${userId}`);
  }

  /** GET directory items from the server */
  download(id: number): void {

    window.location.href=`${this.apiUrl}/directory/download/${id}`;
  }

  /** DELETE: delete the directory item from the server */
  deleteDirectoryItem(file: File | number): Observable<File> {
    const id = typeof file === 'number' ? file : file.id;
    const url = `${this.apiUrl}/directory/${id}`;

    return this.http.delete<File>(url, httpOptions);
  }

  createFolder(userId: number, parentId: number, folderName: string): Observable<File> {
    const formdata: FormData = new FormData();

    formdata.append('userId', `${userId}`);
    formdata.append('parentId', `${parentId}`);
    formdata.append('folderName', folderName);

    console.log("sending request...");
    return this.http.post<File>(this.apiUrl + '/folder', formdata);
  }

  rename(itemId: number, newName: string): Observable<File> {
    const formdata: FormData = new FormData();

    formdata.append('id', `${itemId}`);
    formdata.append('newName', newName);

    console.log("sending request...");
    return this.http.put<File>(this.apiUrl + '/directory', formdata)
  }
}