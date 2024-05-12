import { TestBed } from '@angular/core/testing';

import { LesionClassificationService } from './lesion-classification.service';

describe('LesionClassificationService', () => {
  let service: LesionClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LesionClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
