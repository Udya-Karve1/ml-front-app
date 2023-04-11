import { TestBed } from '@angular/core/testing';

import { GraphPlotService } from './graph.plot.service';

describe('GraphPlotService', () => {
  let service: GraphPlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphPlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
