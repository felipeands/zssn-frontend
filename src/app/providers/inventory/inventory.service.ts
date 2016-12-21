import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Inventory } from '../../models/inventory';
import { Config } from '../../config';

@Injectable()
export class InventoryService {

  private headers: Headers;

  constructor(
    private http: Http,
    private localStorage: LocalStorageService
  ) { }

  setHeaders() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.headers;
  }

  getInventory(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Config.api_people}/${id}/properties.json`).subscribe(
        (res) => { resolve(this.processInventory(res.json())) },
        (err) => { reject() }
      )
    })
  }

  processInventory(data: any) {
    return new Inventory(
      data[0].quantity,
      data[1].quantity,
      data[2].quantity,
      data[3].quantity
    );
  }

}
