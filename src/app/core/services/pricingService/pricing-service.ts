import { Injectable } from '@angular/core';
import { DecorationItem, PricingConfig } from '../../models/pricing-config';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  // Default hourly rate (can be overridden via setter)
  private hourlyRate = 25; // dollars per hour

  // Base prices by cake type and size
  private basePriceMap: Record<string, Record<string, number>> = {
    sheet: {
      small: 20,
      medium: 35,
      large: 50,
    },
    round: {
      '6"': 25,
      '8"': 40,
      '10"': 60,
      '12"': 80,
    },
  };

  // Pre-determined hours estimate by cake type/size
  private baseHoursMap: Record<string, Record<string, number>> = {
    sheet: {
      small: 1.0,
      medium: 1.5,
      large: 2.0,
    },
    round: {
      '6"': 1.5,
      '8"': 2.0,
      '10"': 3.0,
      '12"': 4.0,
    },
  };

  // Flavor costs (F)
  private flavorCostMap: Record<string, number> = {
    vanilla: 0,
    chocolate: 2,
    'red velvet': 4,
    redVelvet: 4,
    marble: 6,
  };

  // Frosting costs (R)
  private frostingCostMap: Record<string, number> = {
    buttercream: 3,
    'cream cheese': 5,
    creamCheese: 5,
    fondant: 8,
  };

  // Per-decoration labor hours (added to H estimate) when estimating from decorations
  private hoursPerDecorationItem = 0.25; // quarter hour per decoration item by default

  setHourlyRate(rate: number) {
    this.hourlyRate = Math.max(0, rate);
  }

  getHourlyRate(): number {
    return this.hourlyRate;
  }

  // Public config interface for callers
  // Keep this inline to avoid creating additional files for a small service
  calculateTotalPrice(config: PricingConfig): number {
    const B = this.getBasePrice(config.cakeType, config.size);
    const F = this.getFlavorCost(config.flavor);
    const R = this.getFrostingCost(config.frosting);
    const D = this.getDecorationCost(config.decorations ?? []);
    const H = this.estimateHours(config);
    const r = config.hourlyRate ?? this.hourlyRate;

    const total = B + F + R + D + H * r;
    return this.roundToTwo(total);
  }

  getBasePrice(cakeType: string, size: string): number {
    const typeKey = cakeType?.toLowerCase() ?? '';
    const sizeKey = size ?? '';
    const typeMap = this.basePriceMap[typeKey];
    if (typeMap && typeMap[sizeKey] != null) return typeMap[sizeKey];
    // Fallback: try numeric parsing from size (e.g., '8"') or return a sensible default
    return 30;
  }

  getFlavorCost(flavor?: string): number {
    if (!flavor) return 0;
    const key = flavor.toLowerCase();
    return this.flavorCostMap[key] ?? 0;
  }

  getFrostingCost(frosting?: string): number {
    if (!frosting) return 0;
    const key = frosting.toLowerCase();
    return this.frostingCostMap[key] ?? 0;
  }

  getDecorationCost(decorations: DecorationItem[]): number {
    if (!decorations || decorations.length === 0) return 0;
    let sum = 0;
    for (const d of decorations) {
      const cost = Math.max(0, d.cost ?? 0);
      const qty = Math.max(0, d.quantity ?? 0);
      sum += cost * qty;
    }
    return this.roundToTwo(sum);
  }

  // Estimate hours (H). If caller provided `hours` in config, use it. Otherwise estimate
  // from baseHoursMap and decorations.
  estimateHours(config: PricingConfig): number {
    if (config.hours != null && config.hours >= 0) return config.hours;

    const cakeType = config.cakeType?.toLowerCase() ?? '';
    const size = config.size ?? '';
    let base = 1.0;
    const typeMap = this.baseHoursMap[cakeType];
    if (typeMap && typeMap[size] != null) base = typeMap[size];

    const decorations = config.decorations ?? [];
    let decoItems = 0;
    for (const d of decorations) decoItems += Math.max(0, d.quantity ?? 0);

    const hours = base + decoItems * this.hoursPerDecorationItem;
    return Math.max(0, Math.round(hours * 100) / 100);
  }

  private roundToTwo(n: number): number {
    return Math.round(n * 100) / 100;
  }

}
