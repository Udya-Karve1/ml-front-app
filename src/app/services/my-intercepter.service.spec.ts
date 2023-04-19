import { TestBed } from '@angular/core/testing';

import { MyIntercepterService } from './my-intercepter.service';

describe('MyIntercepterService', () => {
  let service: MyIntercepterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyIntercepterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
