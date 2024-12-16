import { TestBed } from '@angular/core/testing';

import { DataminingService } from './datamining.service';

describe('DataminingService', () => {
  let service: DataminingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataminingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
