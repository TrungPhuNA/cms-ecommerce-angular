import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OatPageTitleComponent} from './oat-page-title.component';

describe('OatPageTitleComponent', () => {
  let component: OatPageTitleComponent;
  let fixture: ComponentFixture<OatPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OatPageTitleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OatPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
