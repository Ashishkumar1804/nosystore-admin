import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPincodeComponent } from './view-pincode.component';

describe('ViewPincodeComponent', () => {
  let component: ViewPincodeComponent;
  let fixture: ComponentFixture<ViewPincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPincodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
