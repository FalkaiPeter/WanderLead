import { TestBed } from '@angular/core/testing';

import { MyPlansResolver } from './my-plans.resolver.service';

describe('ResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyPlansResolver = TestBed.get(MyPlansResolver);
    expect(service).toBeTruthy();
  });
});
