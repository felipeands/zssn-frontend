import { SpyObject } from './helper';
import { InventoryService } from '../providers/inventory/inventory.service';

import Spy = jasmine.Spy;

export class MockInventoryService extends SpyObject {

  public getOfferItems: Spy;
  public getDidTransaction: Spy;
  public updateCanGet: Spy;
  public fakeResponse: any;

  constructor() {
    super(InventoryService);

    this.fakeResponse = null;
    this.getOfferItems = this.spy('getOfferItems').andReturn(this);
    this.getDidTransaction = this.spy('getDidTransaction').andReturn(this);
    this.updateCanGet = this.spy('updateCanGet').andReturn(this);
  }

  subscribe(callback: any) {
    callback(this.fakeResponse);
  }

  setResponse(json: any): void {
    this.fakeResponse = json;
  }
}
