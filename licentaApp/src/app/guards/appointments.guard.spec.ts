import { TestBed } from '@angular/core/testing';

import { AppointmentsGuard } from './appointments.guard';

describe('AppointmentsGuard', () => {
  let guard: AppointmentsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppointmentsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
