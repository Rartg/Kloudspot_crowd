import { TestBed } from '@angular/core/testing';

import { Graphservices } from './graphservices';

describe('Graphservices', () => {
  let service: Graphservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Graphservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
