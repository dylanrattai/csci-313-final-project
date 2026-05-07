import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth/authService';
import { OrderService } from '../../../../../core/services/orderService/order-service';
import { Order } from '../../../../../core/models/order';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);

  readonly currentUser = this.auth.currentUser;
  readonly orders = this.orderService.orders;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly myOrders = computed(() => {
    const user = this.currentUser();

    if (!user) {
      return [];
    }

    return this.orders().filter((order) => order.customer === user.uid);
  });

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.orderService.loadOrders();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load orders.');
    } finally {
      this.loading.set(false);
    }
  }

  getStatusLabel(order: Order): string {
    return order.status.replaceAll('_', ' ');
  }

  getStatusBadgeClass(order: Order): string {
    switch (order.status) {
      case 'completed':
      case 'received':
        return 'text-bg-success';
      case 'pending':
      case 'in_progress':
        return 'text-bg-warning';
      case 'cancelled':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }

  getItemSummary(order: Order): string {
    return order.order_items.length > 0
      ? `${order.order_items.length} item${order.order_items.length === 1 ? '' : 's'}`
      : 'No items';
  }
}
