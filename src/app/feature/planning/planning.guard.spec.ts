import { TestBed, async, inject } from '@angular/core/testing';

import { PlanningGuard } from './planning.guard';

describe('PlanningGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanningGuard]
    });
  });

  it('should ...', inject([PlanningGuard], (guard: PlanningGuard) => {
    expect(guard).toBeTruthy();
  }));
});
