import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmFormComponent } from './delete-confirm-form.component';

describe('DeleteConfirmFormComponent', () => {
  let component: DeleteConfirmFormComponent;
  let fixture: ComponentFixture<DeleteConfirmFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConfirmFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
