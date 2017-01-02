/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PeopleService } from './people.service';

import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { tick, fakeAsync } from '@angular/core/testing/fake_async';


describe('PeopleService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [{
        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
      },
      { provide: PeopleService, useClass: PeopleService },
      { provide: MockBackend, useClass: MockBackend },
      { provide: BaseRequestOptions, useClass: BaseRequestOptions }
      ]
    });

  });

  it('people service is running', inject([PeopleService], (service: PeopleService) => {
    expect(service).toBeTruthy();
  }));
});
