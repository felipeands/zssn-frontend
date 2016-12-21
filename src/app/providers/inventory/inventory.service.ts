import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Inventory } from '../../models/inventory';
import { Config } from '../../config';

@Injectable()
export class InventoryService {

  @Output() offerItems: EventEmitter<any> = new EventEmitter();

  private headers: Headers;
  private inventoryPoints: Array<any> = [
    { name: 'ammunition', points: 1 },
    { name: 'food', points: 3 },
    { name: 'medication', points: 2 },
    { name: 'water', points: 4 }
  ];

  constructor(
    private http: Http,
    private localStorage: LocalStorageService
  ) { }

  setHeaders() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.headers;
  }

  getInventoryById(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Config.api_people}/${id}/properties.json`).subscribe(
        (res) => { resolve(this.processInventory(res.json())) },
        (err) => { reject() }
      )
    })
  }

  processInventory(data: any) {
    let ammunition = data.find((i: any) => { return i.item.name == 'Ammunition' });
    let food = data.find((i: any) => { return i.item.name == 'Food' });
    let medication = data.find((i: any) => { return i.item.name == 'Medication' });
    let water = data.find((i: any) => { return i.item.name == 'Water' });

    return new Inventory(
      (ammunition) ? ammunition.quantity : 0,
      (food) ? food.quantity : 0,
      (medication) ? medication.quantity : 0,
      (water) ? water.quantity : 0,
    );
  }

  getItemPoints(type: string) {
    return this.inventoryPoints.find((item: any) => { return item.name == type }).points;
  }

  offerMyItems(items: Array<string>) {
    this.offerItems.emit(items);
  }

  getofferItems() {
    return this.offerItems;
  }

}
