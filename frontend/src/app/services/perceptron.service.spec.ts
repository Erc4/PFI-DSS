import { TestBed } from '@angular/core/testing';

import { PerceptronService } from './perceptron.service';

describe('PerceptronService', () => {
  let service: PerceptronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerceptronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
