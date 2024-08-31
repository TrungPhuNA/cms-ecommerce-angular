import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBriefComponent } from './form-brief.component';

describe('FormBriefComponent', () => {
  let component: FormBriefComponent;
  let fixture: ComponentFixture<FormBriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBriefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
