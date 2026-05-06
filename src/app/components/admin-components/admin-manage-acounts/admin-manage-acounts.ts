import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../core/services/userService/user-service';
import { AppUser } from '../../../core/models/appUser';

@Component({
  selector: 'app-admin-manage-acounts',
  standalone: true,
  templateUrl: './admin-manage-acounts.html',
  styleUrl: './admin-manage-acounts.css',
})
export class AdminManageAcounts implements OnInit {
  @Input() user!: AppUser;
  @Input() usersMap: Map<string, any> = new Map();
  newSelectedPermission: AppUser['role'] = 'customer';
  savedPermission: AppUser['role'] = 'customer';
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef); // ← add this

  ngOnInit() {
    this.newSelectedPermission = this.user.role;
    this.savedPermission = this.user.role;
  }

  private async setPermission(permission: AppUser['role']) {
    if (!this.user.id) return;
    await this.userService.updateUser(this.user.id, { role: permission });
    this.savedPermission = permission;
    this.cdr.detectChanges(); // ← force update after async
  }

  setAdmin() {
    this.newSelectedPermission = 'admin';
  }
  setCustomer() {
    this.newSelectedPermission = 'customer';
  }
  setEmployee() {
    this.newSelectedPermission = 'employee';
  }
  confirmPermissionChange() {
    this.setPermission(this.newSelectedPermission);
  }
}
