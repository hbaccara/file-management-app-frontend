import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';

describe('DirectoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileService = TestBed.get(FileService);
    expect(service).toBeTruthy();
  });
});
