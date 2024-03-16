import { TestBed } from '@angular/core/testing';

import { MedicPageGuard } from './medic-page.guard';

describe('MedicPageGuard', () => {
  let guard: MedicPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MedicPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
