import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CakeCustomizationFormControls, DecorationItem } from '../../../core/models/pricing-config';

type DecorationOption = Omit<DecorationItem, 'name'> & {
  name: string;
  description: string;
};

@Component({
  selector: 'app-customization-options',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customization-options.html',
  styleUrl: './customization-options.css',
})
export class CustomizationOptions {
  readonly form = input.required<FormGroup<CakeCustomizationFormControls>>();

  readonly cakeTypeOptions = [
    { value: 'sheet', label: 'Sheet cake' },
    { value: 'round', label: 'Round cake' },
  ];

  readonly sheetSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  readonly roundSizeOptions = [
    { value: '6"', label: '6"' },
    { value: '8"', label: '8"' },
    { value: '10"', label: '10"' },
    { value: '12"', label: '12"' },
  ];

  readonly flavorOptions = [
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'red velvet', label: 'Red Velvet' },
    { value: 'marble', label: 'Marble' },
  ];

  readonly frostingOptions = [
    { value: 'buttercream', label: 'Buttercream' },
    { value: 'cream cheese', label: 'Cream Cheese' },
    { value: 'fondant', label: 'Fondant' },
  ];

  readonly decorationOptions: DecorationOption[] = [
    { name: 'Sprinkles', description: 'Colorful sprinkles', cost: 1, quantity: 1 },
    { name: 'Fruit Topping', description: 'Fresh seasonal fruit', cost: 3, quantity: 1 },
    { name: 'Piped Writing', description: 'Custom message on cake', cost: 5, quantity: 1 },
    { name: 'Fondant Flowers', description: 'Decorative flower accents', cost: 4, quantity: 1 },
  ];

  toggleDecoration(option: DecorationOption): void {
    const decorations = this.form().controls.decorations.value;
    const exists = decorations.some((item) => item.name === option.name);
    if (exists) {
      this.form().controls.decorations.setValue(
        decorations.filter((item) => item.name !== option.name),
      );
      return;
    }

    this.form().controls.decorations.setValue([
      ...decorations,
      { name: option.name, cost: option.cost, quantity: option.quantity },
    ]);
  }

  isDecorationSelected(name: string): boolean {
    const decorations = this.form().controls.decorations.value;
    return decorations.some((item) => item.name === name);
  }
}
