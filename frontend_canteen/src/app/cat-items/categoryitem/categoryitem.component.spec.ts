import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryitemComponent } from './categoryitem.component';

describe('CategoryitemComponent', () => {
  let component: CategoryitemComponent;
  let fixture: ComponentFixture<CategoryitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
