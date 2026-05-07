import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { PremadeMenu } from '../../models/premade_menu';

@Injectable({
  providedIn: 'root',
})
export class PremadeCakeService {
  private readonly premadeCollection = collection(db, 'premade_menu');
  private readonly _premadeCakes = signal<PremadeMenu[]>([]);
  readonly premadeCakes = this._premadeCakes.asReadonly();

  async loadPremadeCakes(): Promise<PremadeMenu[]> {
    const snapshot = await getDocs(this.premadeCollection);
    const cakes: PremadeMenu[] = snapshot.docs.map((d) => ({
      premade_id: d.id,
      ...(d.data() as Omit<PremadeMenu, 'premade_id'>),
    }));
    this._premadeCakes.set(cakes);
    return cakes;
  }

  async getPremadeCake(id: string): Promise<PremadeMenu | null> {
    const snap = await getDoc(doc(db, 'premade_menu', id));
    if (!snap.exists()) return null;
    return {
      premade_id: snap.id,
      ...(snap.data() as Omit<PremadeMenu, 'premade_id'>),
    };
  }

  async createPremadeCake(id: string, data: Omit<PremadeMenu, 'premade_id'>): Promise<void> {
    await setDoc(doc(db, 'premade_menu', id), data, { merge: true });
    await this.loadPremadeCakes();
  }

  async updatePremadeCake(
    id: string,
    data: Partial<Omit<PremadeMenu, 'premade_id'>>
  ): Promise<void> {
    await updateDoc(doc(db, 'premade_menu', id), data);
    await this.loadPremadeCakes();
  }

  async deletePremadeCake(id: string): Promise<void> {
    await deleteDoc(doc(db, 'premade_menu', id));
    await this.loadPremadeCakes();
  }
}
