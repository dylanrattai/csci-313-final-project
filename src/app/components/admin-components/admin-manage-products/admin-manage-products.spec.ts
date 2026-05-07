import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageProducts } from './admin-manage-products';

describe('AdminManageProducts', () => {
  let component: AdminManageProducts;
  let fixture: ComponentFixture<AdminManageProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManageProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
