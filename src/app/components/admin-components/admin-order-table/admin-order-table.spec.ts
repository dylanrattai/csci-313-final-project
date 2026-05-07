import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderTable } from './admin-order-table';

describe('AdminOrderTable', () => {
  let component: AdminOrderTable;
  let fixture: ComponentFixture<AdminOrderTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
