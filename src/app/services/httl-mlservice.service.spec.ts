import { TestBed } from '@angular/core/testing';

import { HttlMLServiceService } from './httl-mlservice.service';

describe('HttlMLServiceService', () => {
  let service: HttlMLServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttlMLServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
