import { Component, Input, OnInit } from '@angular/core';
import { PeopleService } from '../../providers/people/people.service';
import { InventoryService } from '../../providers/inventory/inventory.service';
import { People } from '../../models/people';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-my-inventory',
  templateUrl: './my-inventory.component.html',
  styleUrls: ['./my-inventory.component.scss']
})
export class MyInventoryComponent implements OnInit {

  @Input("its-me") itsMe: boolean;

  public inventory: Inventory;
  private transactionSub: any;
  private profile: People;

  public giveAmmunition: number = 0;
  public giveFood: number = 0;
  public giveMedication: number = 0;
  public giveWater: number = 0;
  public giveItems: Array<string> = [];

  constructor(
    private peopleService: PeopleService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.transactionSub = this.inventoryService.getDidTransaction().subscribe(() => {
      this.loadInventory();
      this.resetGive();
    })
  }

  ngOnChanges() {
    this.profile = this.peopleService.getMyLocalProfile();
    this.loadInventory().then(() => {
      this.resetGive();
    });
  }

  loadInventory() {
    return new Promise((resolve) => {
      if (this.profile) {
        this.inventoryService.getInventoryById(this.profile.id).then((inventory: Inventory) => {
          this.inventory = inventory;
          resolve();
        })
      }
    })
  }

  increase(type: string) {

    let canDo: boolean;

    switch (type) {

      case 'ammunition':
        if (this.inventory.ammunition > 0) {
          this.inventory.ammunition -= 1;
          this.giveAmmunition += 1;
          canDo = true;
        }
        break;

      case 'food':
        if (this.inventory.food > 0) {
          this.inventory.food -= 1;
          this.giveFood += 1;
          canDo = true;
        }
        break;

      case 'medication':
        if (this.inventory.medication > 0) {
          this.inventory.medication -= 1;
          this.giveMedication += 1;
          canDo = true;
        }
        break;

      case 'water':
        if (this.inventory.water > 0) {
          this.inventory.water -= 1;
          this.giveWater += 1;
          canDo = true;
        }
        break;

    }

    if (canDo) {
      this.giveItems.push(type);
      this.inventoryService.offerMyItems(this.giveItems);
    }
  }

  decrease(type: string) {

    let canDo: boolean;

    switch (type) {

      case 'ammunition':
        if (this.giveAmmunition > 0) {
          this.inventory.ammunition += 1;
          this.giveAmmunition -= 1;
          canDo = true;
        }
        break;

      case 'food':
        if (this.giveFood > 0) {
          this.inventory.food += 1;
          this.giveFood -= 1;
          canDo = true;
        }
        break;

      case 'medication':
        if (this.giveMedication > 0) {
          this.inventory.medication += 1;
          this.giveMedication -= 1;
          canDo = true;
        }
        break;

      case 'water':
        if (this.giveWater > 0) {
          this.inventory.water += 1;
          this.giveWater -= 1;
          canDo = true;
        }
        break;

    }

    if (canDo) {
      let index = this.giveItems.indexOf(type);
      if (index > -1) {
        this.giveItems.splice(index, 1);
      }
      this.inventoryService.offerMyItems(this.giveItems);
    }
  }

  resetGive() {
    this.giveAmmunition = 0;
    this.giveFood = 0;
    this.giveMedication = 0;
    this.giveWater = 0;
    this.giveItems = [];
  }

}
