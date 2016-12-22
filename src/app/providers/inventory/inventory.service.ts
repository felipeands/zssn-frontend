import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
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

  calcCanGet(type: string, haveQuantity: number, offerItems: Array<string>) {

    let requiredPoints = this.getItemPoints(type);

    // generate array
    let offerObjs: Array<any> = this.generateArrayItems(offerItems);

    // generate array of min value
    let minItems: Array<any> = this.selectMinItems(requiredPoints, offerObjs);

    // total of items
    let totalPoints: number = this.totalPoints(minItems);

    if (totalPoints == 0) { return false }

    // how much requested items need to trade with the minimum offered item
    let countRequestItems: number = this.calcMinItems(requiredPoints, totalPoints);

    // verify is multiple and have min quantity in inventory
    let result: boolean = (Number.isInteger(totalPoints / requiredPoints) && (countRequestItems <= haveQuantity));

    return result;
  }

  calcQuantities(type: string, offerItems: Array<string>) {
    return new Promise((resolve) => {

      let requiredPoints: number = this.getItemPoints(type);

      // generate array
      let offerObjs: Array<any> = this.generateArrayItems(offerItems);

      // generate array of min value
      let minItems: Array<any> = this.selectMinItems(requiredPoints, offerObjs);

      // total of items
      let totalPoints: number = this.totalPoints(minItems);

      // how much requested items need to trade with the minimum offered item
      let countRequestItems: number = this.calcMinItems(requiredPoints, totalPoints);

      let group: Array<any> = this.groupItems(minItems);

      let result = {
        requestItems: [{ type: type, quantity: countRequestItems }],
        offerItems: group
      };

      resolve(result);
    })
  }

  calcMinItems(requiredPoints: number, totalPoints: number) {
    let countRequestItems: number = 1;
    while ((countRequestItems * requiredPoints) <= totalPoints) {
      countRequestItems++;
    }
    countRequestItems--;
    return countRequestItems
  }

  groupItems(items: Array<any>) {

    let arr: Array<any> = [];

    items.forEach((item: any) => {
      let index: number = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === item.type) {
          index = i;
          break;
        }
      }

      if (index >= 0) {
        arr[index].quantity++;
      } else {
        arr.push({ type: item.type, quantity: 1 });
      }
    });

    return arr;
  }

  selectMinItems(requiredPoints: number, offerObjs: Array<any>) {
    let sum: number = 0;

    let res: Array<any> = offerObjs.filter((item: any) => {
      if (requiredPoints > sum) {
        sum += item.value;
        return item;
      }
    })

    return res;
  }

  totalPoints(items: Array<any>) {
    return items.reduce((total: number, item: any) => { return item.value + total }, 0);
  }

  generateArrayItems(offerItems: Array<string>) {
    let arr = offerItems.map((item: string) => { return { type: item, value: this.getItemPoints(item) } });
    return arr.sort((a, b) => { return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0) });
  }

  doTransaction(person_id: number, requestItems: Array<any>, offerItems: Array<any>) {
    return new Promise((resolve, reject) => {

      let data = [
        `person_id=${person_id}`,
        `consumer[name]=${this.peopleService.getMyLocalProfile().name}`,
        `consumer[pick]=${this.convertItems2Text(requestItems)}`,
        `consumer[payment]=${this.convertItems2Text(offerItems)}`
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

  convertItems2Text(items: Array<any>) {
    return items.map((item: any) => { return `${this.capitalizeFirstLetter(item.type)}:${item.quantity}` }).join(';');
  }

}
