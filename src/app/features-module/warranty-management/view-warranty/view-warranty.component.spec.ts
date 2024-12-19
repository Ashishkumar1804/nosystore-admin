import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWarrantyComponent } from './view-warranty.component';

describe('ViewWarrantyComponent', () => {
  let component: ViewWarrantyComponent;
  let fixture: ComponentFixture<ViewWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewWarrantyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
