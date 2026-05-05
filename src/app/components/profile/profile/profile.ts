import { Component, signal } from '@angular/core';
import { ProfileContent } from '../profile-content/profile';
import { ProfileSidebar } from '../sidebar/sidebar';
import { Addresses } from '../tabs/addresses/addresses';

@Component({
  selector: 'app-profile',
  imports: [ProfileSidebar, ProfileContent, Addresses],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly activeTab = signal<ProfileTab>('account');

  setTab(tab: ProfileTab) {
    this.activeTab.set(tab);
  }
}

export type ProfileTab = 'account' | 'addresses' | 'orders' | 'logout';
