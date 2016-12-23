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
  @Input() infected: boolean;

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
    // subscribe to listen new offered items
    this.inventorySub = this.inventoryService.getOfferItems().subscribe((offerItems: Array<string>) => {
      this.offerItems = offerItems;
      this.updateCanGet();
    });

    // subscribe to inventory changes
    this.transactionSub = this.inventoryService.getDidTransaction().subscribe(() => {
      this.loadInventory().then(() => {
        this.resetTransaction();
      });
    })
  }

  ngOnChanges() {
    // reload inventory
    this.loadInventory().then(() => {

      // reset old transactions
      this.resetTransaction();
    });
  }

  // load inventory by current survivor id
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

  // verify if inventory type can trade
  verifyCanGetItem(type: string, quantityTotal: number) {
    return this.inventoryService.calcCanGet(type, quantityTotal, this.offerItems);
  }

  // update inventory type to allow trades
  updateCanGet() {
    this.canGet = {
      ammunition: !this.infected && this.inventory.ammunition > 0 && this.verifyCanGetItem('ammunition', this.inventory.ammunition),
      food: !this.infected && this.inventory.food > 0 && this.verifyCanGetItem('food', this.inventory.food),
      medication: !this.infected && this.inventory.medication > 0 && this.verifyCanGetItem('medication', this.inventory.medication),
      water: !this.infected && this.inventory.water > 0 && this.verifyCanGetItem('water', this.inventory.water)
    }
  }

  // execute the trade transaction
  doTransaction(type: string) {
    if (confirm(`Do you really need that ${type}?`)) {

      // calc quantities required to trade selected item
      this.inventoryService.calcQuantities(type, this.offerItems).then((res: any) => {

        // do the transaction 
        this.inventoryService.doTransaction(this.id, res.requestItems, res.offerItems).then(
          (res) => { /* alert("Successfully transferred"); */ },
          (err) => { alert("The transaction can't be processed."); }
        )
      })
    }

  }

  // reset trade values
  resetTransaction() {
    this.offerItems = [];
    this.updateCanGet();
  }

}
