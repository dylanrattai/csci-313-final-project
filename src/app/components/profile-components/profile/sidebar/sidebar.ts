import { Component, inject, input, output } from '@angular/core';
import { ProfileTab } from '../profile/profile';
import { AuthService } from '../../../../core/services/auth/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class ProfileSidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  activeTab = input<ProfileTab>('account');
  tabChange = output<ProfileTab>();

  selectTab(tab: ProfileTab) {
    this.tabChange.emit(tab);
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
