import { Component } from '@angular/core';
import { AdminManageAcounts } from '../admin-manage-acounts/admin-manage-acounts';
import { AdminManageProducts } from '../admin-manage-products/admin-manage-products';
import { UserService } from '../../../core/services/userService/user-service';
import { AppUser } from '../../../core/models/appUser';

@Component({
  selector: 'app-admin-manage',
  imports: [AdminManageAcounts, AdminManageProducts],
  templateUrl: './admin-manage.html',
  styleUrl: './admin-manage.css',
})
export class AdminManage {
  private userService = new UserService();
  users = this.userService.users;
  usersMap = new Map<string, AppUser>();
  displayPage: 'accounts' | 'products' = 'accounts';

  constructor() {
    this.loadData();
  }

  private async loadData() {
    const users = await this.userService.loadUsers();
    users.forEach((u) => u.id && this.usersMap.set(u.id, u));

    await this.userService.loadUsers();
  }
}
