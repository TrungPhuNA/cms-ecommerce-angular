import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPopupConfirmComponent } from './show-popup-confirm.component';

describe('ShowPopupConfirmComponent', () => {
  let component: ShowPopupConfirmComponent;
  let fixture: ComponentFixture<ShowPopupConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPopupConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPopupConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
