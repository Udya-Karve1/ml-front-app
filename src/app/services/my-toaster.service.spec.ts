import { TestBed } from '@angular/core/testing';

import { MyToasterService } from './my-toaster.service';

describe('MyToasterService', () => {
  let service: MyToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
