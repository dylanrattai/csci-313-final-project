import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewOrders } from './admin-view-orders';

describe('AdminViewOrders', () => {
  let component: AdminViewOrders;
  let fixture: ComponentFixture<AdminViewOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
