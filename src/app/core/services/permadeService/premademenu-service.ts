import { Injectable, signal } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class PremadeMenuService {

  readonly cakes = signal<any[]>([]);

async loadCakes() {
  const ref = collection(db, 'premade_menu');
  const snapshot = await getDocs(ref);

  const cakes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  this.cakes.set(cakes);
}
  
}
