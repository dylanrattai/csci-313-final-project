import { Injectable, inject, signal, effect } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../orderService/order-service';
import { ItemService } from '../itemService/item-service';
import { AuthService } from '../auth/authService';
import { CustomCakeItem } from '../../models/custom_cake_item';
import { PremadeMenu } from '../../models/premade_menu';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly orderService = inject(OrderService);
  private readonly itemService = inject(ItemService);
  private readonly authService = inject(AuthService);

  // Shopping cart: tracks current pending order for the logged-in user
  private readonly _cart = signal<Order | null>(null);
  readonly cart = this._cart.asReadonly();

  constructor() {
    effect(() => {
      void this.loadCurrentCart();
    });
  }

  private async findPendingOrder(customerId: string): Promise<Order | null> {
    const orders = await this.orderService.loadOrders();
    return (
      orders.find((order) => order.customer === customerId && order.status === 'pending') ?? null
    );
  }

  async loadCurrentCart(): Promise<Order | null> {
    const customerId = this.authService.currentUser()?.uid;

    if (!customerId) {
      this._cart.set(null);
      return null;
    }

    try {
      const pendingOrder = await this.findPendingOrder(customerId);
      this._cart.set(pendingOrder);
      return pendingOrder;
    } catch (error) {
      console.error('Error loading cart:', error);
      this._cart.set(null);
      return null;
    }
  }

  /**
   * Fetch or create a pending order for the current user.
   * Searches existing orders for a pending one; if not found, creates a new empty one.
   * Allows mixing of custom and premade items in a single order.
   */
  private async getOrCreatePendingOrder(customerId: string): Promise<Order | null> {
    try {
      const existingPendingOrder = await this.findPendingOrder(customerId);

      if (existingPendingOrder) {
        this._cart.set(existingPendingOrder);
        return existingPendingOrder;
      }

      // No existing cart found; create a new pending order
      const newOrderId = `order_${customerId}_${Date.now()}`;
      const newOrder: Omit<Order, 'order_id'> = {
        custom_order: false, // will be true if custom cakes are added
        customer: customerId,
        order_items: [],
        price: 0,
        status: 'pending',
      };

      await this.orderService.createOrder(newOrderId, newOrder);
      const createdOrder = await this.orderService.getOrder(newOrderId);

      if (createdOrder) {
        this._cart.set(createdOrder);
        return createdOrder;
      }

      return null;
    } catch (error) {
      console.error('Error getting/creating pending order:', error);
      return null;
    }
  }

  /**
   * Add a custom cake to the cart.
   * Creates a CustomCakeItem in the database and adds it to the pending order.
   */
  async addCustomCakeToCart(customCakeData: {
    cakeType: string;
    size: string;
    flavor?: string;
    frosting?: string;
    message?: string;
    totalPrice: number;
  }): Promise<void> {
    const customerId = this.authService.currentUser()?.uid;
    if (!customerId) {
      throw new Error('Please log in to add items to cart');
    }

    const pendingOrder = await this.getOrCreatePendingOrder(customerId);
    if (!pendingOrder) {
      throw new Error('Error creating/fetching cart. Please try again.');
    }

    // Generate unique item ID
    const itemId = `custom_cake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create CustomCakeItem from customization data
    const customCakeItem: Omit<CustomCakeItem, 'item_id'> = {
      displayItem: false, // custom cakes don't display in general menu
      item_img_path: '', // can be set later or left empty for custom items
      name: `Custom ${customCakeData.cakeType} Cake - ${customCakeData.size}`,
      price: customCakeData.totalPrice,
    };

    // Only add message if it has content (Firestore doesn't allow undefined)
    if (customCakeData.message?.trim()) {
      customCakeItem.message = customCakeData.message.trim();
    }

    // Create the item in database
    await this.itemService.createItem(itemId, customCakeItem);

    // Add item to the pending order
    const updatedOrder: Partial<Omit<Order, 'order_id'>> = {
      custom_order: true, // mark as custom order since custom cake added
      order_items: [...pendingOrder.order_items, itemId],
      price: pendingOrder.price + customCakeData.totalPrice,
    };

    await this.orderService.updateOrder(pendingOrder.order_id, updatedOrder);

    // Refresh cart signal
    this._cart.set({
      ...pendingOrder,
      ...updatedOrder,
      order_id: pendingOrder.order_id,
    } as Order);
  }

  /**
   * Add a premade cake to the cart.
   * Premade cakes are already in the database; we just add their premade_id to the order.
   */
  async addPremadeToCart(premade: PremadeMenu): Promise<void> {
    const customerId = this.authService.currentUser()?.uid;
    if (!customerId) {
      throw new Error('Please log in to add items to cart');
    }

    const pendingOrder = await this.getOrCreatePendingOrder(customerId);
    if (!pendingOrder) {
      throw new Error('Error creating/fetching cart. Please try again.');
    }

    // Add premade item to the pending order
    const updatedOrder: Partial<Omit<Order, 'order_id'>> = {
      order_items: [...pendingOrder.order_items, premade.premade_id],
      price: pendingOrder.price + premade.price,
    };

    await this.orderService.updateOrder(pendingOrder.order_id, updatedOrder);

    // Refresh cart signal
    this._cart.set({
      ...pendingOrder,
      ...updatedOrder,
      order_id: pendingOrder.order_id,
    } as Order);
  }

  /**
   * Clear the cart (for after checkout, etc.)
   */
  clearCart(): void {
    this._cart.set(null);
  }

  /**
   * Update the cart signal with a new order
   */
  updateCart(order: Order): void {
    this._cart.set(order);
  }
}
