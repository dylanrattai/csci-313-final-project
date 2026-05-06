import { Component, computed, inject, input, output, signal } from '@angular/core';
import { PricingService } from '../../../core/services/pricingService/pricing-service';
import { CartService } from '../../../core/services/cartService/cart-service';
import { DecorationItem } from '../../../core/models/pricing-config';
import { CurrencyPipe } from '@angular/common';
import { PremadeMenu } from '../../../core/models/premade_menu';

@Component({
  selector: 'app-price-breakdown',
  imports: [CurrencyPipe],
  templateUrl: './price-breakdown.html',
  styleUrl: './price-breakdown.css',
})
export class PriceBreakdown {
  readonly pricingService = inject(PricingService);
  readonly cartService = inject(CartService);

  cakeType = input('');
  size = input('');
  flavor = input('');
  frosting = input('');
  decorations = input<DecorationItem[]>([]);
  message = input('');
  feedback = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  readonly added = output<void>();

  validationErrors = computed(() => {
    const errors: string[] = [];

    if (!this.cakeType()) errors.push('Cake type is required.');
    if (!this.size()) errors.push('Cake size is required.');
    if (!this.flavor()) errors.push('Flavor is required.');
    if (!this.frosting()) errors.push('Frosting is required.');

    return errors;
  });

  canAddToCart = computed(() => this.validationErrors().length === 0);

  basePrice = computed(() => this.pricingService.getBasePrice(this.cakeType(), this.size()));

  flavorPrice = computed(() => this.pricingService.getFlavorCost(this.flavor()));

  frostingPrice = computed(() => this.pricingService.getFrostingCost(this.frosting()));

  decorationPrice = computed(() => this.pricingService.getDecorationCost(this.decorations()));

  totalPrice = computed(() =>
    this.pricingService.calculateTotalPrice({
      cakeType: this.cakeType(),
      size: this.size(),
      flavor: this.flavor(),
      frosting: this.frosting(),
      decorations: this.decorations(),
      hourlyRate: this.pricingService.getHourlyRate(),
    }),
  );

  private setFeedback(type: 'success' | 'error', text: string): void {
    this.feedback.set({ type, text });
  }

  clearFeedback(): void {
    this.feedback.set(null);
  }

  addToCart() {
    if (!this.canAddToCart()) {
      this.setFeedback('error', 'Please complete all required selections before adding to cart.');
      return;
    }

    this.cartService
      .addCustomCakeToCart({
        cakeType: this.cakeType(),
        size: this.size(),
        flavor: this.flavor(),
        frosting: this.frosting(),
        message: this.message(),
        totalPrice: this.totalPrice(),
      })
      .then(() => {
        this.setFeedback('success', 'Custom cake added to cart.');
        this.added.emit();
      })
      .catch((err) => {
        this.setFeedback(
          'error',
          err instanceof Error ? err.message : 'Unable to add custom cake to cart.',
        );
      });
  }

  addPremadeToCart(premade: PremadeMenu) {
    this.cartService
      .addPremadeToCart(premade)
      .then(() => {
        this.setFeedback('success', `${premade.name} added to cart.`);
      })
      .catch((err) => {
        this.setFeedback(
          'error',
          err instanceof Error ? err.message : 'Unable to add premade cake to cart.',
        );
      });
  }
}
