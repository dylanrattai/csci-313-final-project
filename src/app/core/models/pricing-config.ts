export interface DecorationItem {
  name?: string;
  cost: number;
  quantity: number;
}

export interface CakeCustomizationFormControls {
  cakeType: import('@angular/forms').FormControl<string>;
  size: import('@angular/forms').FormControl<string>;
  flavor: import('@angular/forms').FormControl<string>;
  frosting: import('@angular/forms').FormControl<string>;
  message: import('@angular/forms').FormControl<string>;
  decorations: import('@angular/forms').FormControl<DecorationItem[]>;
}

export interface PricingConfig {
  cakeType: string; // 'sheet' | 'round' etc.
  size: string; // e.g., 'small', 'medium', 'large' or '8"'
  flavor?: string;
  frosting?: string;
  decorations?: DecorationItem[];
  hours?: number; // optional override for H
  hourlyRate?: number; // optional override for r
}
