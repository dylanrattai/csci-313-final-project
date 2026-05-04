import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { CustomCakeItem } from '../../models/custom_cake_item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemsCollection = collection(db, 'custom_cake_item');

  private readonly _items = signal<CustomCakeItem[]>([]);
  readonly items = this._items.asReadonly();

  async loadItems(): Promise<CustomCakeItem[]> {
    const snapshot = await getDocs(this.itemsCollection);

    const items: CustomCakeItem[] = snapshot.docs.map((d) => ({
      item_id: d.id,
      ...(d.data() as Omit<CustomCakeItem, 'item_id'>),
    }));

    this._items.set(items);
    return items;
  }

  async getItem(id: string): Promise<CustomCakeItem | null> {
    const snap = await getDoc(doc(db, 'custom_cake_item', id));
    if (!snap.exists()) return null;

    return {
      item_id: snap.id,
      ...(snap.data() as Omit<CustomCakeItem, 'item_id'>),
    };
  }

  async createItem(id: string, data: Omit<CustomCakeItem, 'item_id'>): Promise<void> {
    await setDoc(doc(db, 'custom_cake_item', id), data, { merge: true });
    await this.loadItems();
  }

  async updateItem(id: string, data: Partial<Omit<CustomCakeItem, 'item_id'>>): Promise<void> {
    await updateDoc(doc(db, 'custom_cake_item', id), data);
    await this.loadItems();
  }

  async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'custom_cake_item', id));
    await this.loadItems();
  }
}
