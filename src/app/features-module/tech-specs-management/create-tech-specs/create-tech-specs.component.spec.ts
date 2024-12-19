import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTechSpecsComponent } from './create-tech-specs.component';

describe('CreateTechSpecsComponent', () => {
  let component: CreateTechSpecsComponent;
  let fixture: ComponentFixture<CreateTechSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTechSpecsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTechSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
