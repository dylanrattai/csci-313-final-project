import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremadeMenu } from './premade-menu';

describe('PremadeMenu', () => {
  let component: PremadeMenu;
  let fixture: ComponentFixture<PremadeMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremadeMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremadeMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
