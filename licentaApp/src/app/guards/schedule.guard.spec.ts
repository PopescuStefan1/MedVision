import { TestBed } from '@angular/core/testing';

import { ScheduleGuard } from './schedule.guard';

describe('ScheduleGuard', () => {
  let guard: ScheduleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ScheduleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
