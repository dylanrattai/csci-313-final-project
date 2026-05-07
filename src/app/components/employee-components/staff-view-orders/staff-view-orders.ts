import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/orderService/order-service';
import { StaffOrderTable } from '../staff-order-table/staff-order-table';
import { UserService } from '../../../core/services/userService/user-service';
import { AppUser } from '../../../core/models/appUser';
import { CustomCakeItem } from '../../../core/models/custom_cake_item';
import { ItemService } from '../../../core/services/itemService/item-service';

@Component({
  selector: 'app-staff-view-orders',
  standalone: true,
  imports: [CommonModule, StaffOrderTable],
  templateUrl: './staff-view-orders.html',
  styleUrls: ['./staff-view-orders.css'],
})
export class StaffViewOrders {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private itemService = inject(ItemService);
  orders = this.orderService.orders;
  itemsMap = new Map<string, CustomCakeItem>();
  usersMap = new Map<string, AppUser>();

  constructor() {
    this.loadData();
  }

  private async loadData() {
    const users = await this.userService.loadUsers();
    users.forEach((u) => u.id && this.usersMap.set(u.id, u));

    const items = await this.itemService.loadItems();
    items.forEach((i) => this.itemsMap.set(i.item_id, i));

    await this.orderService.loadOrders();
  }
}
