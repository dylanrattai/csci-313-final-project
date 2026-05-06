import { computed, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { CakeCustomizationFormControls, DecorationItem } from '../../../core/models/pricing-config';
import { PricingService } from '../../../core/services/pricingService/pricing-service';
import { CustomizationOptions } from '../customization-options/customization-options';
import { PriceBreakdown } from '../price-breakdown/price-breakdown';

@Component({
  selector: 'app-customization-page',
  imports: [ReactiveFormsModule, CustomizationOptions, PriceBreakdown],
  templateUrl: './customization-page.html',
  styleUrl: './customization-page.css',
})
export class CustomizationPage {
  private readonly pricingService = inject(PricingService);

  readonly cakeForm = new FormGroup<CakeCustomizationFormControls>({
    cakeType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    size: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    flavor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    frosting: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true }),
    decorations: new FormControl<DecorationItem[]>([], { nonNullable: true }),
  });

  readonly formValue = toSignal(
    this.cakeForm.valueChanges.pipe(startWith(this.cakeForm.getRawValue())),
    { initialValue: this.cakeForm.getRawValue() },
  );

  readonly totalPrice = computed(() =>
    this.pricingService.calculateTotalPrice({
      cakeType: this.formValue().cakeType ?? '',
      size: this.formValue().size ?? '',
      flavor: this.formValue().flavor ?? '',
      frosting: this.formValue().frosting ?? '',
      decorations: this.formValue().decorations ?? [],
    }),
  );

  resetSelections(): void {
    this.cakeForm.reset({
      cakeType: '',
      size: '',
      flavor: '',
      frosting: '',
      message: '',
      decorations: [],
    });
  }
}
