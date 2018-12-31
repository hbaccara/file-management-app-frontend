import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFormComponent } from './rename-form.component';

describe('RenameFormComponent', () => {
  let component: RenameFormComponent;
  let fixture: ComponentFixture<RenameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
