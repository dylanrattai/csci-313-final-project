import { computed, Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';
import { auth } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<User | null>(null);

  currentUser = this._currentUser.asReadonly();

  isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      this._currentUser.set(user);
    });
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      return userCredential.user;
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      return userCredential.user;
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  getUser() {
    return this._currentUser();
  }

  getUserProfile() {
    const user = this._currentUser();
    if (!user) {
      return null;
    }
    return {
      email: user.email,
      uid: user.uid,
    };
  }

  async updateUserPassword(newPassword: string) {
    const user = this._currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }
    try {
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async sendPasswordReset(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async updateUserEmail(newEmail: string) {
    const user = this._currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await updateEmail(user, newEmail);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async sendVerificationEmail() {
    const user = this._currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async deleteAccount() {
    const user = this._currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await deleteUser(user);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async reauthenticate(email: string, password: string) {
    const user = this._currentUser();
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    const userCred = EmailAuthProvider.credential(email, password);
    try {
      await reauthenticateWithCredential(user, userCred);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  private mapError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email already in use';

      case 'auth/invalid-email':
        return 'Invalid email address';

      case 'auth/weak-password':
        return 'Password must be at least 6 characters';

      case 'auth/user-not-found':
        return 'User not found';

      case 'auth/wrong-password':
        return 'Incorrect password';

      case 'auth/requires-recent-login':
        return 'Please log in again to continue';

      case 'auth/network-request-failed':
        return 'Network error. Check your connection';

      default:
        return 'Something went wrong';
    }
  }
}
