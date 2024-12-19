import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTechSpecsComponent } from './edit-tech-specs.component';

describe('EditTechSpecsComponent', () => {
  let component: EditTechSpecsComponent;
  let fixture: ComponentFixture<EditTechSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTechSpecsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTechSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
