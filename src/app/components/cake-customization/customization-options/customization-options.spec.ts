import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationOptions } from './customization-options';

describe('CustomizationOptions', () => {
  let component: CustomizationOptions;
  let fixture: ComponentFixture<CustomizationOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizationOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizationOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
