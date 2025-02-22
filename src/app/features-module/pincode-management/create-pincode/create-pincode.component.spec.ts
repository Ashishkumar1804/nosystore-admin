import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePincodeComponent } from './create-pincode.component';

describe('CreatePincodeComponent', () => {
  let component: CreatePincodeComponent;
  let fixture: ComponentFixture<CreatePincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePincodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
