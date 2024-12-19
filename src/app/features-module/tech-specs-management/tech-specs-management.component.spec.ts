import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSpecsManagementComponent } from './tech-specs-management.component';

describe('TechSpecsManagementComponent', () => {
  let component: TechSpecsManagementComponent;
  let fixture: ComponentFixture<TechSpecsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechSpecsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechSpecsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
