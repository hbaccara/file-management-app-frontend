import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderCreationFormComponent } from './folder-creation-form.component';

describe('FolderCreationFormComponent', () => {
  let component: FolderCreationFormComponent;
  let fixture: ComponentFixture<FolderCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
