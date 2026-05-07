import { TestBed } from '@angular/core/testing';

import { PremadeCakeService } from './premade-cake-service';

describe('PremadeCakeService', () => {
  let service: PremadeCakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremadeCakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
