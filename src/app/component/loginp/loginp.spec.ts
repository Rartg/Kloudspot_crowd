import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loginp } from './loginp';

describe('Loginp', () => {
  let component: Loginp;
  let fixture: ComponentFixture<Loginp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loginp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loginp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
