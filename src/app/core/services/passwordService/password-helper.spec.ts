import { TestBed } from '@angular/core/testing';

import { PasswordHelper } from './password-helper';

describe('PasswordHelper', () => {
  let service: PasswordHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
