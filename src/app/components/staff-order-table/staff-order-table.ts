import { Component, Input, inject } from '@angular/core';
import { Order } from '../../core/models/order';
import { OrderService } from '../../core/services/orderService/order-service';
import { AppUser } from '../../core/models/appUser';
import { CustomCakeItem } from '../../core/models/custom_cake_item';

@Component({
  selector: 'app-staff-order-table',
  standalone: true,
  templateUrl: './staff-order-table.html',
  styleUrl: './staff-order-table.css',
})
export class StaffOrderTable {
  @Input() order!: Order;

  // 🔑 NEW: lookup maps
  @Input() usersMap!: Map<string, AppUser>;
  @Input() itemsMap!: Map<string, CustomCakeItem>;

  private orderService = inject(OrderService);

  private updateStatus(status: Order['status']) {
    this.orderService.updateOrder(this.order.order_id, { status });
  }

  setApproved() {
    this.updateStatus('pending');
  }

  setInProgress() {
    this.updateStatus('in_progress');
  }

  setFinished() {
    this.updateStatus('completed');
  }

  setReceived() {
    this.updateStatus('received');
  }
}
