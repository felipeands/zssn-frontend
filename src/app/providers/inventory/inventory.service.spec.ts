/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InventoryService } from './inventory.service';

import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { tick, fakeAsync } from '@angular/core/testing/fake_async';

import { PeopleService } from '../people/people.service';
import { MockPeopleService } from '../../mocks/people.service';

describe('InventoryService', () => {

  let mockPeopleService: MockPeopleService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [{
        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
      },
      { provide: PeopleService, useValue: mockPeopleService },
      { provide: InventoryService, useClass: InventoryService },
      { provide: MockBackend, useClass: MockBackend },
      { provide: BaseRequestOptions, useClass: BaseRequestOptions }
      ]
    });

  });

  it('inventory service is running', inject([InventoryService], (service: InventoryService) => {
    expect(service).toBeTruthy();
  }));
});
