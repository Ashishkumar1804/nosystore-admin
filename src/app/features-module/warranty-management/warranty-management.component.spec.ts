import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyManagementComponent } from './warranty-management.component';

describe('WarrantyManagementComponent', () => {
  let component: WarrantyManagementComponent;
  let fixture: ComponentFixture<WarrantyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarrantyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
