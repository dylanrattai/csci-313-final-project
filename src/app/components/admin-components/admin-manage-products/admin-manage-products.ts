import { ChangeDetectorRef, Component, inject, Input, input } from '@angular/core';
import { CustomCakeItem } from '../../../core/models/custom_cake_item';
import { ItemService } from '../../../core/services/itemService/item-service';

@Component({
  selector: 'app-admin-manage-products',
  imports: [],
  templateUrl: './admin-manage-products.html',
  styleUrl: './admin-manage-products.css',
})
export class AdminManageProducts {
  @Input() product!: CustomCakeItem;
  private cdr = inject(ChangeDetectorRef);
  private itemService = inject(ItemService);
  savedName = '';
  savedPrice = 0;
  savedDisplay = false;
  savedImgPath = '';
  newName = '';
  newPrice = 0;
  newDisplay = false;
  newImgPath = '';

  ngOnInit() {
    this.savedName = this.product.name;
    this.savedPrice = this.product.price;
    this.savedDisplay = this.product.displayItem;
    this.savedImgPath = this.product.item_img_path;
    this.newName = this.product.name;
    this.newPrice = this.product.price;
    this.newDisplay = this.product.displayItem;
    this.newImgPath = this.product.item_img_path;
  }

  private async setName(name: string) {
    if (!this.product.item_id) return;
    await this.itemService.updateItem(this.product.item_id, { name });
    this.savedName = name;
    this.product.name = name;
    this.cdr.detectChanges();
  }

  private async setPrice(price: number) {
    if (!this.product.item_id) return;
    await this.itemService.updateItem(this.product.item_id, { price });
    this.savedPrice = price;
    this.product.price = price;
    this.cdr.detectChanges();
  }

  // should the item be displayed on the menu
  private async setDisplay(display: boolean) {
    if (!this.product.item_id) return;
    await this.itemService.updateItem(this.product.item_id, { displayItem: display });
    this.savedDisplay = display;
    this.product.displayItem = display;
    this.cdr.detectChanges();
  }

  private async setImgPath(path: string) {
    if (!this.product.item_id) return;
    await this.itemService.updateItem(this.product.item_id, { item_img_path: path });
    this.savedImgPath = path;
    this.product.item_img_path = path;
    this.cdr.detectChanges();
  }

  setNameInput(input: string) {
    this.newName = input;
  }

  setPriceInput(input: string) {
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) this.newPrice = parsed;
  }

  setDisplayInput(input: boolean) {
    this.newDisplay = input;
  }

  setImgPathInput(input: string) {
    this.newImgPath = input;
  }

  confirmChanges() {
    if (this.savedName !== this.newName) this.setName(this.newName);
    if (this.savedPrice !== this.newPrice) this.setPrice(this.newPrice);
    if (this.savedDisplay !== this.newDisplay) this.setDisplay(this.newDisplay);
    if (this.savedImgPath !== this.newImgPath) this.setImgPath(this.newImgPath);
  }
}
