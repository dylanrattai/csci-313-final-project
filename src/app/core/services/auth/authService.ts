import { computed, inject, Injectable, signal } from '@angular/core';
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
import { auth } from '../../../firebase.config';
import { AppUser } from '../../models/appUser';
import { UserService } from '../user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);

  private readonly _appUser = signal<AppUser | null>(null);

  readonly appUser = this._appUser.asReadonly();

  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  readonly isAdmin = computed(() => this._appUser()?.role === 'admin');

  constructor() {
    this.initAuthStateListener();
  }

  private async initAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      this._currentUser.set(user);

      if (!user) {
        this._appUser.set(null);
        return;
      }

      try {
        const appUser = await this.userService.getUser(user.uid);
        if (this._currentUser()?.uid === user.uid) {
          this._appUser.set(appUser);
        }
      } catch {
        this._appUser.set(null);
      }
    });
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      await this.userService.createUser(user.uid, {
        email: user.email ?? email,
        role: 'customer',
      });
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async updateUserPassword(newPassword: string): Promise<void> {
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

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  async updateUserEmail(newEmail: string): Promise<void> {
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

  async sendVerificationEmail(): Promise<void> {
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

  async deleteAccount(): Promise<void> {
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

  async reauthenticate(email: string, password: string): Promise<void> {
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
