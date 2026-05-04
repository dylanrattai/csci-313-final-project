import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { AuthService } from '../../../../core/services/auth/authService';
import { UserService } from '../../../../core/services/userService/user-service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly user = this.auth.currentUser()?.uid;

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.email]),
  });

  submitted = false;
  error: string | null = null;

  async onSubmit() {
    this.form.markAllAsTouched();
    this.submitted = true;

    if (this.form.invalid) {
      this.error = 'Please fix the highlighted fields.';
      return;
    }

    this.error = null;

    const { firstName, lastName, email } = this.form.getRawValue();

    try {
    } catch (error: unknown) {
      this.error =
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
    }
  }
}
