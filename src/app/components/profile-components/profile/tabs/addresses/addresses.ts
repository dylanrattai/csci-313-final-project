import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../../core/services/addressService/address-service';
import { Address } from '../../../../../core/models/address';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
})
export class Addresses implements OnInit {
  private readonly addressService = inject(AddressService);

  readonly addresses = this.addressService.addresses;

  readonly form = new FormGroup({
    line1: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    line2: new FormControl('', { nonNullable: true }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    state: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    zip: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly editingId = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly loading = signal(false);

  ngOnInit() {
    void this.addressService.loadAddresses();
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (control?.invalid ?? false) && ((control?.touched ?? false) || this.submitted());
  }

  edit(address: Address) {
    this.editingId.set(address.id || null);
    this.form.patchValue({
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    this.error.set(null);
    this.success.set(null);
    this.submitted.set(false);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset();
    this.submitted.set(false);
    this.error.set(null);
    this.success.set(null);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    this.submitted.set(true);

    if (this.form.invalid) {
      this.error.set('Please fix the highlighted fields.');
      this.success.set(null);
      return;
    }

    const formValue = this.form.getRawValue();
    const addressData = {
      line1: formValue.line1.trim(),
      line2: formValue.line2?.trim() || '',
      city: formValue.city.trim(),
      state: formValue.state.trim(),
      zip: formValue.zip.trim(),
      country: formValue.country.trim(),
    };

    this.loading.set(true);
    this.error.set(null);

    try {
      const editingId = this.editingId();

      if (editingId) {
        await this.addressService.updateAddress(editingId, addressData);
        this.success.set('Address updated successfully.');
      } else {
        await this.addressService.addAddress(addressData);
        this.success.set('Address added successfully.');
      }

      this.form.reset();
      this.editingId.set(null);
      this.submitted.set(false);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save address.');
      this.success.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  async delete(addressId: string | undefined) {
    if (!addressId || !confirm('Are you sure you want to delete this address?')) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.addressService.deleteAddress(addressId);
      this.success.set('Address deleted successfully.');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to delete address.');
      this.success.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
