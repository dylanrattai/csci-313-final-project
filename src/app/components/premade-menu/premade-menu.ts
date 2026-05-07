import { Component, inject, OnInit } from '@angular/core';
import { PremadeMenuService } from '../../core/services/permadeService/premademenu-service';
import { CartService } from '../../core/services/cartService/cart-service';
@Component({
  selector: 'app-premade-menu',
  standalone: true,
  templateUrl: './premade-menu.html',
    styleUrl: './premade-menu.css',
})
export class PremadeMenu implements OnInit {

  private premadeService = inject(PremadeMenuService);

  readonly cakes = this.premadeService.cakes;

  readonly cartServices = inject(CartService);

  async ngOnInit() {
    await this.premadeService.loadCakes();
  }
}