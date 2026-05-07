import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageSelector } from './admin-manage-selector';

describe('AdminManageSelector', () => {
  let component: AdminManageSelector;
  let fixture: ComponentFixture<AdminManageSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManageSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
