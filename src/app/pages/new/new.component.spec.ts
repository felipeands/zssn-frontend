/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NewComponent } from './new.component';
import { PeopleService } from '../../providers/people/people.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute, MockRouter } from '../../mocks/routes';
import { MockPeopleService } from '../../mocks/people.service';

describe('NewComponent', () => {

  let mockPeopleService: MockPeopleService;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {

    mockPeopleService = new MockPeopleService();
    mockActivatedRoute = new MockActivatedRoute({ 'term': 'peyton' });
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [NewComponent],
      providers: [
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  });

  it('new component is running', () => {
    let fixture = TestBed.createComponent(NewComponent);
    let component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
