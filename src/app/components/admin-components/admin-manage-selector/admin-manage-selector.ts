import { Component, input, output } from '@angular/core';
import { AdminTab } from '../admin-manage/admin-manage';

@Component({
  selector: 'app-admin-manage-selector',
  imports: [],
  standalone: true,
  templateUrl: './admin-manage-selector.html',
  styleUrl: './admin-manage-selector.css',
})
export class AdminManageSelector {
  activeTab = input<AdminTab>('accounts');
  tabChange = output<AdminTab>();

  selectTab(tab: AdminTab) {
    this.tabChange.emit(tab);
  }
}
