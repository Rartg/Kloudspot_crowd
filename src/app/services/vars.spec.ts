import { TestBed } from '@angular/core/testing';

import { Vars } from './vars';

describe('Vars', () => {
  let service: Vars;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vars);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
