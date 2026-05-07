import { Injectable, signal } from '@angular/core';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { PremadeMenu } from '../../models/premade_menu';

@Injectable({
  providedIn: 'root',
})
export class PremadeMenuService {
  readonly cakes = signal<PremadeMenu[]>([]);

  async loadCakes(): Promise<PremadeMenu[]> {
    const ref = collection(db, 'premade_menu');
    const snapshot = await getDocs(ref);

    const cakes: PremadeMenu[] = snapshot.docs.map((cakeDoc) => ({
      premade_id: cakeDoc.id,
      ...(cakeDoc.data() as Omit<PremadeMenu, 'premade_id'>),
    }));

    this.cakes.set(cakes);
    return cakes;
  }

  async getCake(id: string): Promise<PremadeMenu | null> {
    const snap = await getDoc(doc(db, 'premade_menu', id));

    if (!snap.exists()) {
      return null;
    }

    return {
      premade_id: snap.id,
      ...(snap.data() as Omit<PremadeMenu, 'premade_id'>),
    };
  }
}
