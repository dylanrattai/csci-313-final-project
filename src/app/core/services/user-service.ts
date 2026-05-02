import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AppUser } from '../models/appUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersCollection = collection(db, 'users');

  private readonly _users = signal<AppUser[]>([]);

  readonly users = this._users.asReadonly();

  async loadUsers(): Promise<AppUser[]> {
    const snapshot = await getDocs(this.usersCollection);

    const users: AppUser[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<AppUser, 'id'>),
    }));

    this._users.set(users);

    return users;
  }

  async getUser(id: string): Promise<AppUser | null> {
    const snap = await getDoc(doc(db, 'users', id));
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as Omit<AppUser, 'id'>),
    };
  }

  async createUser(uid: string, data: Omit<AppUser, 'id'>): Promise<void> {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    await this.loadUsers();
  }

  async updateUser(id: string, data: Partial<Omit<AppUser, 'id'>>): Promise<void> {
    await updateDoc(doc(db, 'users', id), data);
    await this.loadUsers();
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', id));
    await this.loadUsers();
  }
}
