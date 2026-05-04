import { Component, inject, input } from '@angular/core';
import { ProfileTab } from '../profile/profile';
import { Account } from '../tabs/account/account';
import { AuthService } from '../../../core/services/auth/authService';

@Component({
  selector: 'app-profile-content',
  imports: [Account],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileContent {
  private readonly auth = inject(AuthService);
  
  activeTab = input<ProfileTab>('account');

  readonly user = this.auth.appUser;
}
