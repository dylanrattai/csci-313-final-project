import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffViewOrders } from './staff-view-orders';

describe('StaffViewOrders', () => {
  let component: StaffViewOrders;
  let fixture: ComponentFixture<StaffViewOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffViewOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffViewOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
