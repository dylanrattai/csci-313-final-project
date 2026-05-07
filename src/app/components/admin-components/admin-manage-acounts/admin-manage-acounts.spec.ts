import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAcounts } from './admin-manage-acounts';

describe('AdminManageAcounts', () => {
  let component: AdminManageAcounts;
  let fixture: ComponentFixture<AdminManageAcounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManageAcounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageAcounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
