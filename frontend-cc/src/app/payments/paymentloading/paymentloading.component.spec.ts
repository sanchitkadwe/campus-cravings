import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentloadingComponent } from './paymentloading.component';

describe('PaymentloadingComponent', () => {
  let component: PaymentloadingComponent;
  let fixture: ComponentFixture<PaymentloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentloadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
