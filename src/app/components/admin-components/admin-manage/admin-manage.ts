import { Component, inject, signal } from '@angular/core';
import { AdminManageAcounts } from '../admin-manage-acounts/admin-manage-acounts';
import { AdminManageProducts } from '../admin-manage-products/admin-manage-products';
import { AdminManageSelector } from '../admin-manage-selector/admin-manage-selector';
import { UserService } from '../../../core/services/userService/user-service';
import { AppUser } from '../../../core/models/appUser';
import { ItemService } from '../../../core/services/itemService/item-service';
import { CustomCakeItem } from '../../../core/models/custom_cake_item';
import { PremadeCakeService } from '../../../core/services/premade-cake-service/premade-cake-service';
import { PremadeMenu } from '../../../core/models/premade_menu';
import { AdminManagePremade } from '../admin-manage-premade/admin-manage-premade';

@Component({
  selector: 'app-admin-manage',
  imports: [AdminManageAcounts, AdminManageProducts, AdminManageSelector, AdminManagePremade],
  templateUrl: './admin-manage.html',
  styleUrl: './admin-manage.css',
})
export class AdminManage {
  private readonly userService = inject(UserService);
  private readonly itemService = inject(ItemService);
  private readonly premadeCakeService = inject(PremadeCakeService);
  users = this.userService.users;
  usersMap = new Map<string, AppUser>();
  items = this.itemService.items;
  itemsMap = new Map<string, CustomCakeItem>();
  premadeItems = this.premadeCakeService.premadeCakes;
  premadeCakesMap = new Map<string, PremadeMenu>();

  readonly activeTab = signal<AdminTab>('accounts');

  setTab(tab: AdminTab) {
    this.activeTab.set(tab);
  }

  constructor() {
    this.loadData();
  }

  private async loadData() {
    const users = await this.userService.loadUsers();
    users.forEach((u) => u.id && this.usersMap.set(u.id, u));

    await this.userService.loadUsers();

    const items = await this.itemService.loadItems();
    items.forEach((i) => i.item_id && this.itemsMap.set(i.item_id, i));

    await this.itemService.loadItems();

    const premadeCakes = await this.premadeCakeService.loadPremadeCakes();
    premadeCakes.forEach((c) => c.premade_id && this.premadeCakesMap.set(c.premade_id, c));

    await this.premadeCakeService.loadPremadeCakes();
  }
}
export type AdminTab = 'accounts' | 'products';
