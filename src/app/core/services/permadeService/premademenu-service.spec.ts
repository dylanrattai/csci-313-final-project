import { TestBed } from '@angular/core/testing';

import { PremadeMenuService } from './premademenu-service';

describe('PremadeMenu', () => {
  let service: PremadeMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremadeMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
