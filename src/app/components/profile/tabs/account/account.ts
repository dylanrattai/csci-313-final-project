import { Component, inject, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/authService';
import { UserService } from '../../../../core/services/userService/user-service';
import { AppUser } from '../../../../core/models/appUser';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  @Input() set initialData(value: AppUser | null) {
    if (value) {
      this.form.patchValue({
        firstName: value.firstName ?? '',
        lastName: value.lastName ?? '',
        phone: value.phone ?? '',
        email: value.email ?? '',
      });
    }
  }

  @Output() formSubmit = new EventEmitter<Partial<AppUser>>();

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl('', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]),
    email: new FormControl('', [Validators.email]),
  });

  submitted = false;
  error: string | null = null;
  success = signal<string | null>(null);

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (control?.invalid ?? false) && ((control?.touched ?? false) || this.submitted);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    this.submitted = true;

    if (this.form.invalid) {
      this.error = 'Please fix the highlighted fields.';
      return;
    }

    this.error = null;

    const currentUser = this.auth.currentUser();

    if (!currentUser) {
      this.error = 'No user is currently logged in.';
      return;
    }

    const { firstName, lastName, email, phone } = this.form.getRawValue();

    const userUpdate: Partial<AppUser> = {};
    if (firstName && firstName.trim()) userUpdate.firstName = firstName.trim();
    if (lastName && lastName.trim()) userUpdate.lastName = lastName.trim();
    if (email && email.trim()) userUpdate.email = email.trim();
    if (phone && phone.trim()) userUpdate.phone = phone.trim();

    try {
      if (userUpdate.email) {
        await this.auth.reauthenticate(currentUser.email ?? '', prompt('Please enter your current password to change your email:') || '');
        await this.auth.updateUserEmail(userUpdate.email);
      }
      await this.userService.updateUser(currentUser.uid, userUpdate);
      this.success.set('Profile updated successfully!');
      this.error = null;
      this.submitted = false;
    } catch (error: unknown) {
      this.error =
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      this.success.set(null);
    }
  }
}
