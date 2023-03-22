import { TestBed } from '@angular/core/testing';

import { ComponentInterService } from './component-inter.service';

describe('ComponentInterService', () => {
  let service: ComponentInterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentInterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
