import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartbaseComponent } from './cartbase.component';

describe('CartbaseComponent', () => {
  let component: CartbaseComponent;
  let fixture: ComponentFixture<CartbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartbaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
