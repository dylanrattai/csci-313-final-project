import { Component, computed, inject, OnInit } from '@angular/core';
import { PremadeMenuService } from '../../core/services/permadeService/premademenu-service';
import { CartService } from '../../core/services/cartService/cart-service';
import { PremadeMenu as PremadeMenuItem } from '../../core/models/premade_menu';

@Component({
  selector: 'app-premade-menu',
  standalone: true,
  templateUrl: './premade-menu.html',
  styleUrl: './premade-menu.css',
})
export class PremadeMenu implements OnInit {
  private readonly premadeService = inject(PremadeMenuService);

  readonly cakes = this.premadeService.cakes;
  readonly visibleCakes = computed(() => this.cakes().filter((cake) => cake.display_on_menu));

  private readonly cartService = inject(CartService);

  async ngOnInit(): Promise<void> {
    await this.premadeService.loadCakes();
  }

  async addToOrder(cake: PremadeMenuItem): Promise<void> {
    try {
      await this.cartService.addPremadeToCart(cake);
    } catch (error) {
      console.error('Failed to add premade cake to cart:', error);
    }
  }
}
