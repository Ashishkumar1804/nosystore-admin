import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeComponent } from './add-attribute.component';

describe('AddAttributeComponent', () => {
  let component: AddAttributeComponent;
  let fixture: ComponentFixture<AddAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
