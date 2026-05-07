import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { RouterLinkWithHref, Router } from '@angular/router';
import { CartService } from '../../core/services/cartService/cart-service';
import { AddressService } from '../../core/services/addressService/address-service';
import { AuthService } from '../../core/services/auth/authService';
import { OrderService } from '../../core/services/orderService/order-service';
import { ItemService } from '../../core/services/itemService/item-service';
import { CustomCakeItem } from '../../core/models/custom_cake_item';
import { PremadeMenu } from '../../core/models/premade_menu';
import { PremadeMenuService } from '../../core/services/permadeService/premademenu-service';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLinkWithHref, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly addressService = inject(AddressService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly itemService = inject(ItemService);
  private readonly premadeMenuService = inject(PremadeMenuService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Form for checkout details
  checkoutForm!: FormGroup;

  // Signals
  deliveryType = signal<'pickup' | 'delivery'>('delivery');
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  formInvalid = signal(true);

  // Readonly signals from services
  cart = this.cartService.cart;
  addresses = this.addressService.addresses;
  currentUser = this.authService.currentUser;

  // Signals for item catalogs (cached from services)
  customCakes = this.itemService.items;
  premadeCakes = this.premadeMenuService.cakes;

  // Computed values
  cartItems = computed(() => {
    const pendingOrder = this.cart();
    return pendingOrder?.order_items ?? [];
  });

  /**
   * Compute total as the sum of all item prices in the cart.
   * This ensures the total is always accurate based on actual items.
   */
  cartTotal = computed(() => {
    return this.cartItems().reduce((sum, itemId) => {
      return sum + this.getItemPrice(itemId);
    }, 0);
  });

  constructor() {
    // Keep required email populated when auth user arrives after form initialization.
    effect(() => {
      const email = this.currentUser()?.email ?? '';
      const emailControl = this.checkoutForm?.get('email');
      if (!emailControl) return;
      if (email && !emailControl.value) {
        emailControl.setValue(email);
      }
    });
  }

  ngOnInit() {
    this.initializeForm();
    // Load item catalogs from services
    void Promise.all([
      this.loadAddresses(),
      this.itemService.loadItems(),
      this.premadeMenuService.loadCakes(),
      this.cartService.loadCurrentCart(),
    ]);
  }

  /**
   * Retrieve an item from cached catalogs.
   * Tries custom cakes first (by item_id), then premade cakes (by premade_id).
   * Returns null if item not found in either catalog.
   */
  getItemFromCatalog(itemId: string): CustomCakeItem | PremadeMenu | null {
    // Try custom cakes first
    const customCake = this.customCakes().find((item) => item.item_id === itemId);
    if (customCake) {
      return customCake;
    }

    // Try premade cakes
    const premadeCake = this.premadeCakes().find((item) => item.premade_id === itemId);
    if (premadeCake) {
      return premadeCake;
    }

    return null;
  }

  /**
   * Check if an item is a custom cake (has item_id property).
   */
  isCustomCakeItem(item: CustomCakeItem | PremadeMenu | null): item is CustomCakeItem {
    return item ? 'item_id' in item : false;
  }

  /**
   * Get the display name for a cart item.
   * For custom cakes, returns the stored name from the custom cake record.
   * For premade cakes, returns the name from the premade menu record.
   */
  getItemDisplayName(itemId: string): string {
    const item = this.getItemFromCatalog(itemId);
    if (item) {
      return item.name;
    }
    // Fallback (should not happen if catalog is loaded)
    return 'Item';
  }

  /**
   * Get the price for a cart item.
   * Retrieves price from the item record (custom or premade).
   */
  getItemPrice(itemId: string): number {
    const item = this.getItemFromCatalog(itemId);
    return item?.price ?? 0;
  }

  private expirationDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || typeof value !== 'string') {
        return null;
      }

      const match = /^([0-9]{2})\/([0-9]{2})$/.exec(value.trim());
      if (!match) {
        return null;
      }

      const month = Number(match[1]);
      const year = Number(match[2]);

      if (month < 1 || month > 12) {
        return { expiredCard: true };
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { expiredCard: true };
      }

      return null;
    };
  }

  private initializeForm() {
    const userEmail = this.currentUser()?.email || '';

    this.checkoutForm = this.fb.group({
      deliveryType: ['delivery', Validators.required],
      addressId: [''], // Will be conditionally required
      phone: ['', [Validators.pattern(/^\d{10}$|^$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiry: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/), this.expirationDateValidator()],
      ],
      cardCVC: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      email: [userEmail, [Validators.required, Validators.email]],
    });

    // Update delivery type signal and conditionally set addressId validation
    this.checkoutForm.get('deliveryType')?.valueChanges.subscribe((val) => {
      this.deliveryType.set(val);
      this.updateAddressValidation(val === 'delivery');
    });

    // Track form validity via a signal so template updates with OnPush CD
    this.checkoutForm.statusChanges.subscribe(() => {
      this.formInvalid.set(this.checkoutForm.invalid);
    });

    // initialize form invalid state
    this.formInvalid.set(this.checkoutForm.invalid);
    // Apply validator state for the initial selected delivery method.
    this.updateAddressValidation(this.checkoutForm.get('deliveryType')?.value === 'delivery');
  }

  private updateAddressValidation(isDelivery: boolean): void {
    const addressControl = this.checkoutForm.get('addressId');
    if (!addressControl) return;

    if (isDelivery) {
      addressControl.setValidators([Validators.required]);
    } else {
      addressControl.clearValidators();
    }

    addressControl.updateValueAndValidity();
  }

  private async loadAddresses() {
    try {
      await this.addressService.loadAddresses();
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  }

  async deleteFromCart(itemId: string): Promise<void> {
    try {
      const pendingOrder = this.cart();
      if (!pendingOrder) return;

      // Ensure itemId is a string (Firestore data might have type issues)
      const normalizedItemId = String(itemId);

      // Get the item price FIRST (before any catalog changes)
      const itemPrice = this.getItemPrice(normalizedItemId);

      // Hard delete: Remove custom cake document from Firestore
      if (normalizedItemId.startsWith('custom_cake_')) {
        try {
          await this.itemService.deleteItem(normalizedItemId);
        } catch (deleteError) {
          console.error(`Failed to delete custom cake item ${normalizedItemId}:`, deleteError);
          // Continue with order update even if item deletion fails
        }
      }

      // Remove only the first matching item so duplicates remain in the cart
      const updatedItems = [...pendingOrder.order_items];
      const removalIndex = updatedItems.findIndex((id) => String(id) === normalizedItemId);

      if (removalIndex === -1) {
        throw new Error(`Item ${normalizedItemId} was not found in the cart.`);
      }

      updatedItems.splice(removalIndex, 1);

      const currentPrice = Number(pendingOrder.price) || 0;
      const updatedPrice = Math.max(0, currentPrice - itemPrice);

      // Update the order in Firestore
      await this.orderService.updateOrder(pendingOrder.order_id, {
        order_items: updatedItems,
        price: updatedPrice,
      });

      // Refresh cart with updated data from Firestore
      const refreshedOrder = await this.orderService.getOrder(pendingOrder.order_id);
      if (refreshedOrder) {
        this.cartService.updateCart(refreshedOrder);
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      this.submitError.set('Failed to remove item from cart.');
    }
  }

  /**
   * Navigate to custom cake editor for the given custom cake item.
   */
  editCustomCake(itemId: string): void {
    this.router.navigate(['/custom-cake'], {
      queryParams: { editItemId: itemId },
    });
  }

  async placeOrder() {
    if (this.checkoutForm.invalid || !this.cart()) {
      this.submitError.set('Please fill in all required fields');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      const pendingOrder = this.cart();
      if (!pendingOrder) {
        throw new Error('Cart is empty');
      }

      const formValues = this.checkoutForm.value;

      // Update order status to 'needs approval' (from pending)
      await this.orderService.updateOrder(pendingOrder.order_id, {
        status: 'needs approval',
        // Optionally store delivery info (this depends on your Order model expansion)
        // deliveryType: formValues.deliveryType,
        // address: selectedAddress,
        // phone: formValues.phone,
      });

      // Clear cart
      this.cartService.clearCart();

      // Show success message
      this.successMessage.set('Order placed successfully! Redirecting...');

      // Navigate to home after a short delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      this.submitError.set('Failed to place order. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Check if cart is empty
  isCartEmpty = computed(() => {
    return this.cartItems().length === 0;
  });
}
