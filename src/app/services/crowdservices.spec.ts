import { TestBed } from '@angular/core/testing';

import { Crowdservices } from './crowdservices';

describe('Crowdservices', () => {
  let service: Crowdservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crowdservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
