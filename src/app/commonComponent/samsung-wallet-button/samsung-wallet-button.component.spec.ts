import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamsungWalletButtonComponent } from './samsung-wallet-button.component';

describe('SamsungWalletButtonComponent', () => {
  let component: SamsungWalletButtonComponent;
  let fixture: ComponentFixture<SamsungWalletButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamsungWalletButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamsungWalletButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
