import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/authService';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  submitted = false;
  error: string | null = null;

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  async onSubmit() {
    this.form.markAllAsTouched();
    this.submitted = true;

    if (this.form.invalid) {
      this.error = 'Please fix the highlighted fields.';
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.login(email, password);
      await this.router.navigate(['/']);
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  isInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];

    return control.invalid && (control.touched || this.submitted);
  }
}
