import { Component, input, output } from '@angular/core';
import { ProfileTab } from '../profile/profile';

@Component({
  selector: 'app-profile-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class ProfileSidebar {
  activeTab = input<ProfileTab>('account');
  tabChange = output<ProfileTab>();

  selectTab(tab: ProfileTab){
    this.tabChange.emit(tab);
  }
}
