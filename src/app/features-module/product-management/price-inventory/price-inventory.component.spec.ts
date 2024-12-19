import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceInventoryComponent } from './price-inventory.component';

describe('PriceInventoryComponent', () => {
  let component: PriceInventoryComponent;
  let fixture: ComponentFixture<PriceInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
