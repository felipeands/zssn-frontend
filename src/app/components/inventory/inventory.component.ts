import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { InventoryService } from '../../providers/inventory/inventory.service';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() id: number;
  @Input() itsMe: boolean;
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
    };
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
    });
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
      });
    });
  }

  ngOnDestroy() {
    // this.inventorySub.unsubscribe();
    // this.transactionSub.unsubscribe();
  }

  // verify if inventory type can trade
  verifyCanGetItem(type: string, quantityTotal: number) {
    return this.inventoryService.calcCanGet(type, quantityTotal, this.offerItems);
  }

  // update inventory type to allow trades
  updateCanGet() {
    this.canGet = {
      ammunition: false,
      food: false,
      medication: false,
      water: false
    };

    if (!this.infected && this.inventory) {

      if (this.inventory.ammunition > 0 && this.verifyCanGetItem('ammunition', this.inventory.ammunition)) {
        this.canGet.ammunition = true;
      }

      if (this.inventory.food > 0 && this.verifyCanGetItem('food', this.inventory.food)) {
        this.canGet.food = true;
      }

      if (this.inventory.medication > 0 && this.verifyCanGetItem('medication', this.inventory.medication)) {
        this.canGet.medication = true;
      }

      if (this.inventory.water > 0 && this.verifyCanGetItem('water', this.inventory.water)) {
        this.canGet.water = true;
      }

    }

  }

  // execute the trade transaction
  doTransaction(type: string) {
    if (confirm(`Do you really need that ${type}?`)) {

      // calc quantities required to trade selected item
      this.inventoryService.calcQuantities(type, this.offerItems).then((res: any) => {

        // do the transaction 
        this.inventoryService.doTransaction(this.id, res.requestItems, res.offerItems).then(
          (success) => { console.log('Successfully transferred'); },
          (err) => { alert('The transaction can\'t be processed.'); }
        );
      });
    }

  }

  // reset trade values
  resetTransaction() {
    this.offerItems = [];
    this.updateCanGet();
  }

}
