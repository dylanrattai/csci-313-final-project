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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLinkWithHref, Router } from '@angular/router';
import { CartService } from '../../core/services/cartService/cart-service';
import { AddressService } from '../../core/services/addressService/address-service';
import { AuthService } from '../../core/services/auth/authService';
import { OrderService } from '../../core/services/orderService/order-service';
import { ItemService } from '../../core/services/itemService/item-service';
import { CustomCakeItem } from '../../core/models/custom_cake_item';
import { PremadeMenu } from '../../core/models/premade_menu';

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
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Form for checkout details
  checkoutForm!: FormGroup;

  // Signals
  deliveryType = signal<'pickup' | 'delivery'>('delivery');
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  itemDetails = signal<Map<string, CustomCakeItem | PremadeMenu>>(new Map());
  formInvalid = signal(true);

  // Readonly signals from services
  cart = this.cartService.cart;
  addresses = this.addressService.addresses;
  currentUser = this.authService.currentUser;

  // Computed values
  cartItems = computed(() => {
    const pendingOrder = this.cart();
    return pendingOrder?.order_items ?? [];
  });

  cartTotal = computed(() => {
    return this.cart()?.price ?? 0;
  });

  constructor() {
    // Load item details when cartItems changes
    effect(() => {
      const items = this.cartItems();
      items.forEach((itemId) => {
        this.loadItemDetail(itemId);
      });
    });

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
    this.loadAddresses();
  }

  private async loadItemDetail(itemId: string) {
    try {
      const item = await this.itemService.getItem(itemId);
      if (item) {
        const currentMap = this.itemDetails();
        const newMap = new Map(currentMap);
        newMap.set(itemId, item);
        this.itemDetails.set(newMap);
      }
    } catch (error) {
      console.error(`Failed to load item ${itemId}:`, error);
    }
  }

  private initializeForm() {
    const userEmail = this.currentUser()?.email || '';

    this.checkoutForm = this.fb.group({
      deliveryType: ['delivery', Validators.required],
      addressId: [''], // Will be conditionally required
      phone: ['', [Validators.pattern(/^\d{10}$|^$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
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

      const item = this.itemDetails().get(itemId);
      const itemPrice = item?.price ?? 0;

      // Remove item from order items array
      const updatedItems = pendingOrder.order_items.filter((id) => id !== itemId);
      const updatedPrice = Math.max(0, pendingOrder.price - itemPrice);

      // Update the order
      await this.orderService.updateOrder(pendingOrder.order_id, {
        order_items: updatedItems,
        price: updatedPrice,
      });

      // Refresh cart with updated data
      const refreshedOrder = await this.orderService.getOrder(pendingOrder.order_id);
      if (refreshedOrder) {
        this.cartService.updateCart(refreshedOrder);
      }

      // Remove from item details cache
      const newMap = new Map(this.itemDetails());
      newMap.delete(itemId);
      this.itemDetails.set(newMap);
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      this.submitError.set('Failed to remove item from cart.');
    }
  }

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

  // Get item price by ID
  getItemPrice(itemId: string): number {
    const item = this.itemDetails().get(itemId);
    return item?.price ?? 0;
  }

  // Check if cart is empty
  isCartEmpty = computed(() => {
    return this.cartItems().length === 0;
  });
}
