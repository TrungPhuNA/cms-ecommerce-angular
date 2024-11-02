import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStockOutComponent } from './form-stock-out.component';

describe('FormStockOutComponent', () => {
  let component: FormStockOutComponent;
  let fixture: ComponentFixture<FormStockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormStockOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
