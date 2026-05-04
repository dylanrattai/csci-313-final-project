import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { Order } from '../../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // FIX: use "order" instead of "orders"
  private readonly ordersCollection = collection(db, 'order');

  private readonly _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  async loadOrders(): Promise<Order[]> {
    const snapshot = await getDocs(this.ordersCollection);

    const orders: Order[] = snapshot.docs.map((d) => ({
      order_id: d.id,
      ...(d.data() as Omit<Order, 'order_id'>),
    }));

    this._orders.set(orders);
    return orders;
  }

  async getOrder(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, 'order', id));
    if (!snap.exists()) return null;

    return {
      order_id: snap.id,
      ...(snap.data() as Omit<Order, 'order_id'>),
    };
  }

  async createOrder(id: string, data: Omit<Order, 'order_id'>): Promise<void> {
    await setDoc(doc(db, 'order', id), data, { merge: true });
    await this.loadOrders();
  }

  async updateOrder(id: string, data: Partial<Omit<Order, 'order_id'>>): Promise<void> {
    await updateDoc(doc(db, 'order', id), data);
    await this.loadOrders();
  }

  async deleteOrder(id: string): Promise<void> {
    await deleteDoc(doc(db, 'order', id));
    await this.loadOrders();
  }
}
