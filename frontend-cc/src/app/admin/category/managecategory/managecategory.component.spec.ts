import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecategoryComponent } from './managecategory.component';

describe('ManagecategoryComponent', () => {
  let component: ManagecategoryComponent;
  let fixture: ComponentFixture<ManagecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
