import { SpyObject } from './helper';
import { PeopleService } from '../providers/people/people.service';

import Spy = jasmine.Spy;

export class MockPeopleService extends SpyObject {

  public add: Spy;
  public getDidTransaction: Spy;
  public updateCanGet: Spy;
  public fakeResponse: any;

  constructor() {
    super(PeopleService);

    this.fakeResponse = null;
    this.add = this.spy('add').andReturn(this);
  }

  subscribe(callback: any) {
    callback(this.fakeResponse);
  }

  setResponse(json: any): void {
    this.fakeResponse = json;
  }
}
