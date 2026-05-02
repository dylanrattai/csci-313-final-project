import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/authService';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error: string | null = null;

  form = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [passwordMatchValidator] },
  );

  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.error = this.form.hasError('passwordMismatch')
        ? 'Passwords do not match.'
        : 'Please fix the highlighted fields.';
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.loading = true;
    this.error = null;

    try {
      await this.auth.register(email, password);
      await this.router.navigate(['/']);
    } catch (error: unknown) {
      this.error =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  clearError() {
    this.error = null;
  }

  isInvalid(controlName: 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }
}

const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};
