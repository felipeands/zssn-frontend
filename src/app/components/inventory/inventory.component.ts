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
  @Input("its-me") itsMe: boolean;

  public inventory: Inventory;
  private inventorySub: any;
  private transactionSub: any;
  private offerItems: Array<string>;
  public canGet: any;

  constructor(
    private inventoryService: InventoryService
  ) {
    this.canGet = {
      ammunition: false,
      food: false,
      medication: false,
      water: false
    }
  }

  ngOnInit() {
    this.inventorySub = this.inventoryService.getOfferItems().subscribe((offerItems: Array<string>) => {
      this.offerItems = offerItems;
      this.updateCanGet();
    });
    this.transactionSub = this.inventoryService.getDidTransaction().subscribe(() => {
      this.loadInventory().then(() => {
        this.resetTransaction();
      });
    })
  }

  ngOnChanges() {
    this.loadInventory().then(() => {
      this.resetTransaction();
    });
  }

  loadInventory() {
    return new Promise((resolve) => {
      this.inventoryService.getInventoryById(this.id).then((inventory: Inventory) => {
        this.inventory = inventory;
        resolve();
      })
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

  verifyCanGetItem(type: string, quantityTotal: number) {
    return this.inventoryService.calcCanGet(type, quantityTotal, this.offerItems);
  }

  updateCanGet() {
    this.canGet = {
      ammunition: this.inventory.ammunition > 0 && this.verifyCanGetItem('ammunition', this.inventory.ammunition),
      food: this.inventory.food > 0 && this.verifyCanGetItem('food', this.inventory.food),
      medication: this.inventory.medication > 0 && this.verifyCanGetItem('medication', this.inventory.medication),
      water: this.inventory.water > 0 && this.verifyCanGetItem('water', this.inventory.water)
    }
  }

  doTransaction(type: string) {
    if (confirm(`Do you really need that ${type}?`)) {
      this.inventoryService.calcQuantities(type, this.offerItems).then((res: any) => {
        this.inventoryService.doTransaction(this.id, res.requestItems, res.offerItems).then(
          (res) => { /* alert("Successfully transferred"); */ },
          (err) => { alert("The transaction can't be processed."); }
        )
      })
    }

  }

  resetTransaction() {
    this.offerItems = [];
    this.updateCanGet();
  }

}
