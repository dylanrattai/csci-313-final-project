import { Component, Input, inject } from '@angular/core';
import { Order } from '../../../core/models/order';
import { OrderService } from '../../../core/services/orderService/order-service';
import { AppUser } from '../../../core/models/appUser';
import { CustomCakeItem } from '../../../core/models/custom_cake_item';

@Component({
  selector: 'app-admin-order-table',
  standalone: true,
  templateUrl: './admin-order-table.html',
  styleUrl: './admin-order-table.css',
})
export class AdminOrderTable {
  @Input() order!: Order;

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

  setUnapproved() {
    this.updateStatus('needs approval');
  }

  setCancelled() {
    this.updateStatus('cancelled');
  }
}
