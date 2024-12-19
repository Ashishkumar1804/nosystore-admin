import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWarrantyComponent } from './create-warranty.component';

describe('CreateWarrantyComponent', () => {
  let component: CreateWarrantyComponent;
  let fixture: ComponentFixture<CreateWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWarrantyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
