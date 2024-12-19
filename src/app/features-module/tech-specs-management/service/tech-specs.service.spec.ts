import { TestBed } from '@angular/core/testing';

import { TechSpecsService } from './tech-specs.service';

describe('TechSpecsService', () => {
  let service: TechSpecsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechSpecsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
