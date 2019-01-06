import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSearchService {

  searchTerm: string;

  constructor() { }

  clearSearchTerm(): void{
    this.searchTerm = undefined;
  }
}
