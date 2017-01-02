/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InventoryComponent } from './inventory.component';
import { InventoryService } from '../../providers/inventory/inventory.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute, MockRouter } from '../../mocks/routes';
import { MockInventoryService } from '../../mocks/inventory.service';

describe('InventoryComponent', () => {

  let mockInventoryService: MockInventoryService;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  // let component: InventoryComponent;
  // let fixture: ComponentFixture<InventoryComponent>;

  beforeEach(() => {

    mockInventoryService = new MockInventoryService();
    mockActivatedRoute = new MockActivatedRoute({ 'term': 'peyton' });
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [InventoryComponent],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    });

  });

  it('should create', () => {
    let fixture = TestBed.createComponent(InventoryComponent);
    let inventoryComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(inventoryComponent).toBeTruthy();
  });
});
