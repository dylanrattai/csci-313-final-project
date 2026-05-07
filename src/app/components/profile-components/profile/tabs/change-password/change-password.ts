import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth/authService';
import { PasswordHelper } from '../../../../../core/services/passwordService/password-helper';
import { AppUser } from '../../../../../core/models/appUser';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private readonly auth = inject(AuthService);
  private readonly passwordHelper = inject(PasswordHelper);

  @Input() set initialData(value: AppUser | null) {
    if (value) {
      this.form.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }

  @Output() formSubmit = new EventEmitter<Partial<AppUser>>();

  form = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmNewPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: [this.passwordHelper.passwordMatchValidator('newPassword', 'confirmNewPassword')],
    }
  );

  submitted = false;
  error: string | null = null;
  success = signal<string | null>(null);

  isInvalid(controlName: 'currentPassword' | 'newPassword' | 'confirmNewPassword'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  showPasswordMismatch(): boolean {
    const confirm = this.form.controls.confirmNewPassword;
    return this.form.hasError('passwordMismatch') && (confirm.touched || this.submitted);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    this.submitted = true;

    if (this.form.invalid) {
      this.error = this.form.hasError('passwordMismatch')
        ? 'New passwords do not match.'
        : 'Please fix the highlighted fields.';
      this.success.set(null);
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();

    const currentUser = this.auth.currentUser();
    const currentEmail = currentUser?.email;
    if (!currentEmail) {
      this.error = 'No authenticated user email available to reauthenticate.';
      this.success.set(null);
      return;
    }

    try {
      await this.auth.reauthenticate(currentEmail, currentPassword);
      await this.auth.updateUserPassword(newPassword);

      this.error = null;
      this.success.set('Password changed successfully.');
      this.submitted = false;
      this.form.reset({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: unknown) {
      this.error =
        error instanceof Error ? error.message : 'Failed to change password. Please try again.';
      this.success.set(null);
    }
  }
}
