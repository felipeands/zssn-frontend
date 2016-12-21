import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { PeopleService } from '../people/people.service';
import { Inventory } from '../../models/inventory';
import { Config } from '../../config';

@Injectable()
export class InventoryService {

  @Output() offerItems: EventEmitter<any> = new EventEmitter();
  @Output() didTransaction: EventEmitter<any> = new EventEmitter();

  private headers: Headers;
  private inventoryPoints: Array<any> = [
    { name: 'ammunition', points: 1 },
    { name: 'food', points: 3 },
    { name: 'medication', points: 2 },
    { name: 'water', points: 4 }
  ];

  constructor(
    private http: Http,
    private localStorage: LocalStorageService,
    private peopleService: PeopleService
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

  getOfferItems() {
    return this.offerItems;
  }

  onDidTransaction() {
    this.didTransaction.emit();
  }

  getDidTransaction() {
    return this.didTransaction;
  }

  doTransaction(person_id: number, requestedItem: string, offerItems: Array<string>) {
    return new Promise((resolve, reject) => {

      let data = [
        `person_id=${person_id}`,
        `consumer[name]=${this.peopleService.getMyLocalProfile().name}`,
        `consumer[pick]=${this.capitalizeFirstLetter(requestedItem)}:1`,
        `consumer[payment]=${this.formatItems(this.countItems(offerItems))}`
      ];

      this.setHeaders();
      this.http.post(`${Config.api_people}/${person_id}/properties/trade_item.json`, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { 
          this.onDidTransaction();
          resolve(); 
        },
        (err) => { reject() }
        )

    })
  }

  capitalizeFirstLetter(text: string) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  }

  countItems(offerItems: Array<string>) {
    return offerItems.reduce((prev: any, cur: any) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
  }

  formatItems(obj: any) {
    let items = [];
    Object.keys(obj).forEach((key: string) => {
      items.push(`${this.capitalizeFirstLetter(key)}:${obj[key]}`);
    });
    return items.join(';');
  }

}
