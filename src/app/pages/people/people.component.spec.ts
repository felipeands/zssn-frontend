/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PeopleComponent } from './people.component';
import { InventoryService } from '../../providers/inventory/inventory.service';
import { PeopleService } from '../../providers/people/people.service';
import { GenderPipe } from '../../pipes/gender/gender.pipe';

import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute, MockRouter } from '../../mocks/routes';
import { MockInventoryService } from '../../mocks/inventory.service';
import { MockPeopleService } from '../../mocks/people.service';

describe('PeopleComponent', () => {

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
      declarations: [PeopleComponent, GenderPipe],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  });

  it('people component is running', () => {
    let fixture = TestBed.createComponent(PeopleComponent);
    let component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
