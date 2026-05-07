import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagePremade } from './admin-manage-premade';

describe('AdminManagePremade', () => {
  let component: AdminManagePremade;
  let fixture: ComponentFixture<AdminManagePremade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManagePremade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManagePremade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
