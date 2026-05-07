import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOrderTable } from './staff-order-table';

describe('StaffOrderTable', () => {
  let component: StaffOrderTable;
  let fixture: ComponentFixture<StaffOrderTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffOrderTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffOrderTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
