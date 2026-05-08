import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { PremadeMenu } from '../../../core/models/premade_menu';
import { PremadeCakeService } from '../../../core/services/premade-cake-service/premade-cake-service';

@Component({
  selector: 'app-admin-manage-premade',
  imports: [],
  templateUrl: './admin-manage-premade.html',
  styleUrl: './admin-manage-premade.css',
})
export class AdminManagePremade {
  @Input() product!: PremadeMenu;
  private cdr = inject(ChangeDetectorRef);
  private premadeCakeService = inject(PremadeCakeService);
  isSaving = false;
  saveMessage = '';
  saveError = '';
  savedName = '';
  savedPrice = 0;
  savedDisplayOnMenu = false;
  savedDescription = '';
  savedImgPath = '';
  newName = '';
  newPrice = 0;
  newDisplayOnMenu = false;
  newDescription = '';
  newImgPath = '';

  ngOnInit() {
    this.savedName = this.product.name;
    this.savedPrice = this.product.price;
    this.savedDisplayOnMenu = this.product.display_on_menu;
    if (this.product.description) {
      this.savedDescription = this.product.description;
      this.newDescription = this.product.description;
    }
    this.savedImgPath = this.product.img_path;
    this.newName = this.product.name;
    this.newPrice = this.product.price;
    this.newDisplayOnMenu = this.product.display_on_menu;
    this.newImgPath = this.product.img_path;
  }

  private async setName(name: string) {
    if (!this.product.premade_id) return;
    await this.premadeCakeService.updatePremadeCake(this.product.premade_id, { name });
    this.savedName = name;
    this.product.name = name;
    this.cdr.detectChanges();
  }

  private async setPrice(price: number) {
    if (!this.product.premade_id) return;
    await this.premadeCakeService.updatePremadeCake(this.product.premade_id, { price });
    this.savedPrice = price;
    this.product.price = price;
    this.cdr.detectChanges();
  }

  private async setDisplay(display: boolean) {
    if (!this.product.premade_id) return;
    await this.premadeCakeService.updatePremadeCake(this.product.premade_id, {
      display_on_menu: display,
    });
    this.savedDisplayOnMenu = display;
    this.product.display_on_menu = display;
    this.cdr.detectChanges();
  }

  private async setImgPath(path: string) {
    if (!this.product.premade_id) return;
    await this.premadeCakeService.updatePremadeCake(this.product.premade_id, { img_path: path });
    this.savedImgPath = path;
    this.product.img_path = path;
    this.cdr.detectChanges();
  }

  private async setDescription(description: string) {
    if (!this.product.premade_id) return;
    await this.premadeCakeService.updatePremadeCake(this.product.premade_id, { description });
    this.savedDescription = description;
    this.product.description = description;
    this.cdr.detectChanges();
  }

  setNewName(input: string) {
    this.newName = input;
  }

  setNewPrice(input: string) {
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) this.newPrice = parsed;
  }

  setNewDisplay(input: boolean) {
    this.newDisplayOnMenu = input;
  }

  setNewImgPath(input: string) {
    this.newImgPath = input;
  }

  setNewDescription(input: string) {
    this.newDescription = input;
  }

  async confirmChanges() {
    this.isSaving = true;
    this.saveMessage = '';
    this.saveError = '';

    try {
      if (!this.product.premade_id) {
        throw new Error('Missing premade cake id.');
      }

      const updateData: Partial<Omit<PremadeMenu, 'premade_id'>> = {};

      if (this.savedName !== this.newName) updateData.name = this.newName;
      if (this.savedPrice !== this.newPrice) updateData.price = this.newPrice;
      if (this.savedImgPath !== this.newImgPath) updateData.img_path = this.newImgPath;
      if (this.savedDisplayOnMenu !== this.newDisplayOnMenu) {
        updateData.display_on_menu = this.newDisplayOnMenu;
      }
      if (this.savedDescription !== this.newDescription) {
        updateData.description = this.newDescription;
      }

      if (Object.keys(updateData).length === 0) {
        this.saveMessage = 'No changes to save.';
        return;
      }

      await this.premadeCakeService.updatePremadeCake(this.product.premade_id, updateData);

      this.savedName = this.newName;
      this.savedPrice = this.newPrice;
      this.savedImgPath = this.newImgPath;
      this.savedDisplayOnMenu = this.newDisplayOnMenu;
      this.savedDescription = this.newDescription;

      this.product.name = this.newName;
      this.product.price = this.newPrice;
      this.product.img_path = this.newImgPath;
      this.product.display_on_menu = this.newDisplayOnMenu;
      this.product.description = this.newDescription;

      this.saveMessage = 'Changes saved.';
    } catch (error) {
      console.error('Failed to save premade cake changes:', error);
      this.saveError = 'Failed to save changes. Please try again.';
    }

    this.isSaving = false;
    this.cdr.detectChanges();
  }
}
