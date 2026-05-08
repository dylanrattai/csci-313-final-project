import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PremadeMenu } from '../premade-menu/premade-menu';
import { PremadeMenuService } from '../../core/services/permadeService/premademenu-service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, PremadeMenu],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly premadeService = inject(PremadeMenuService);

  cakes = this.premadeService.cakes;

  async ngOnInit() {
    await this.premadeService.loadCakes();
  }

  get groupedCakes() {
  const cakes = this.cakes();
  const groups = [];

  for (let i = 0; i < cakes.length; i += 3) {
    groups.push(cakes.slice(i, i + 3));
  }

  return groups;
}
}