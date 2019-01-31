import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { File } from '../models/file';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }  

  uploadFile(parentId: number, file: Blob): Observable<HttpEvent<any>> {
    const formdata: FormData = new FormData();

    formdata.append('parentId', `${parentId}`);
    formdata.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl + '/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(directoryId: number): Observable<any> {

    return this.http.get<File[]>(`${this.apiUrl}/directory/${directoryId}`);
  }

  searchFiles(searchTerm: string): Observable<File[]> {

    return this.http.get<File[]>(`${this.apiUrl}/files/search?searchTerm=${searchTerm}`);
  }

  getFilesSharedWithUser(): Observable<File[]> {

    return this.http.get<File[]>(`${this.apiUrl}/files/shared-with-user`);
  }

  download(id: number): void {

    window.location.href=`${this.apiUrl}/directory/download/${id}?t=${this.authService.authToken}`;
  }

  /** DELETE: delete the directory item from the server */
  deleteDirectoryItem(file: File | number): Observable<File> {
    const id = typeof file === 'number' ? file : file.id;
    const url = `${this.apiUrl}/directory/${id}`;

    return this.http.delete<File>(url);
  }

  createFolder(parentId: number, folderName: string): Observable<File> {
    const formdata: FormData = new FormData();

    formdata.append('parentId', `${parentId}`);
    formdata.append('folderName', folderName);

    return this.http.post<File>(this.apiUrl + '/folder', formdata);
  }

  rename(itemId: number, newName: string): Observable<File> {
    const formdata: FormData = new FormData();

    formdata.append('id', `${itemId}`);
    formdata.append('newName', newName);

    return this.http.put<File>(this.apiUrl + '/file/rename', formdata)
  }

  move(itemId: number, newParentId: number): Observable<File> {
    const formdata: FormData = new FormData();

    formdata.append('id', `${itemId}`);
    formdata.append('newParentId', `${newParentId}`);

    return this.http.put<File>(this.apiUrl + '/file/move', formdata)
  }
}