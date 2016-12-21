import { Component, Input, OnInit } from '@angular/core';
import { InventoryService } from '../../providers/inventory/inventory.service';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @Input() id: number;

  public inventory: Inventory;
  private inventorySub: any;
  private transactionSub: any;
  private offerItems: Array<string>;
  private offerPoints: number;
  public canGet: any = {
    ammunition: false,
    food: false,
    medication: false,
    water: false
  };

  constructor(
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.inventorySub = this.inventoryService.getOfferItems().subscribe((offerItems: Array<string>) => {
      this.offerItems = offerItems;
      this.offerPoints = this.calcOfferPoints(offerItems);
      this.updateCanGet();
    });
    this.transactionSub = this.inventoryService.getDidTransaction().subscribe(() => {
      this.loadInventory();
      this.resetTransaction();
    })
  }

  ngOnChanges() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getInventoryById(this.id).then((inventory: Inventory) => {
      this.inventory = inventory;
    })
  }

  ngOnDestroy() {
    this.inventorySub.unsubscribe();
    this.transactionSub.unsubscribe();
  }

  calcOfferPoints(items: Array<string>) {
    let res: number = items.map((item: string) => {
      return this.inventoryService.getItemPoints(item);
    }).reduce((total: number, item: number) => {
      return total + item;
    }, 0);

    return res;
  }

  verifyCanGetItem(type: string) {
    let need = this.inventoryService.getItemPoints(type);
    return (need == this.offerPoints);
  }

  updateCanGet() {
    this.canGet = {
      ammunition: this.inventory.ammunition > 0 && this.verifyCanGetItem('ammunition'),
      food: this.inventory.food > 0 && this.verifyCanGetItem('food'),
      medication: this.inventory.medication > 0 && this.verifyCanGetItem('medication'),
      water: this.inventory.water > 0 && this.verifyCanGetItem('water')
    }
  }

  doTransaction(type: string) {
    let yes = confirm(`Do you really need that ${type}?`);
    if (yes) {
      this.inventoryService.doTransaction(this.id, type, this.offerItems).then((res) => {
        alert("Successfully transferred");
      }, (err) => {
        alert("The transaction can't be processed.")
      })
    }
  }

  resetTransaction() {
    this.offerItems = null;
    this.offerPoints = null;
    this.updateCanGet();
  }
}
