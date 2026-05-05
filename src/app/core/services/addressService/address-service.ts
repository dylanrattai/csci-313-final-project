import { inject, Injectable, signal } from '@angular/core';
import { Address } from '../../models/address';
import { AuthService } from '../auth/authService';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly auth = inject(AuthService);

  private readonly _addresses = signal<Address[]>([]);
  readonly addresses = this._addresses.asReadonly();

  private getCollection() {
    const user = this.auth.currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }
    return collection(db, 'users', user.uid, 'addresses');
  }

  async loadAddresses(): Promise<Address[]> {
    const snapshot = await getDocs(this.getCollection());

    const data: Address[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Address, 'id'>),
    }));
    this._addresses.set(data);
    return data;
  }

  async addAddress(address: Omit<Address, 'id'>): Promise<void> {
    const col = this.getCollection();
    const ref = doc(col); // auto-id

    await setDoc(ref, address);

    await this.loadAddresses();
  }

  async updateAddress(id: string, address: Omit<Address, 'id'>): Promise<void> {
    const col = this.getCollection();
    await updateDoc(doc(col, id), address);

    await this.loadAddresses();
  }

  async deleteAddress(id: string): Promise<void> {
    const col = this.getCollection();
    await deleteDoc(doc(col, id));

    await this.loadAddresses();
  }


}
