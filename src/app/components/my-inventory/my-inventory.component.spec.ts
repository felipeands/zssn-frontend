/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyInventoryComponent } from './my-inventory.component';
import { InventoryService } from '../../providers/inventory/inventory.service';
import { PeopleService } from '../../providers/people/people.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute, MockRouter } from '../../mocks/routes';
import { MockInventoryService } from '../../mocks/inventory.service';
import { MockPeopleService } from '../../mocks/people.service';

describe('MyInventoryComponent', () => {

  let mockInventoryService: MockInventoryService;
  let mockPeopleService: MockPeopleService;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {

    mockInventoryService = new MockInventoryService();
    mockPeopleService = new MockPeopleService();
    mockActivatedRoute = new MockActivatedRoute({ 'term': 'peyton' });
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [MyInventoryComponent],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    });

  });

  it('should create', () => {
    let fixture = TestBed.createComponent(MyInventoryComponent);
    let component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
