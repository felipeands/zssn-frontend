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

  public giveAmmunition: number = 0;
  public giveFood: number = 0;
  public giveMedication: number = 0;
  public giveWater: number = 0;
  public givePoints: number = 0;

  constructor(
    private peopleService: PeopleService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    let people = this.peopleService.getMyLocalProfile();

    if (people) {
      this.inventoryService.getInventoryById(people.id).then((inventory: Inventory) => {
        this.inventory = inventory;
      })
    }
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
      this.givePoints += this.inventoryService.getItemPoints(type);
      this.inventoryService.offerMyPoints(this.givePoints);
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
      this.givePoints -= this.inventoryService.getItemPoints(type);
      this.inventoryService.offerMyPoints(this.givePoints);
    }
  }

}
