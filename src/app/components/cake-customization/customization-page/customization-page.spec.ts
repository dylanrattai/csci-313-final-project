import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationPage } from './customization-page';

describe('CustomizationPage', () => {
  let component: CustomizationPage;
  let fixture: ComponentFixture<CustomizationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
