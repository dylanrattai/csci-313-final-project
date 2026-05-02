import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { AuthService } from './core/services/auth/authService';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { auth } from './firebase.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('TheBakeShop');

  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async ngOnInit() {
    await setPersistence(auth, browserLocalPersistence);
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
