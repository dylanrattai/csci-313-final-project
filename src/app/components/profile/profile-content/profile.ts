import { Component, input } from '@angular/core';
import { ProfileTab } from '../profile/profile';

@Component({
  selector: 'app-profile-content',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileContent {
activeTab = input<ProfileTab>('account');
}
