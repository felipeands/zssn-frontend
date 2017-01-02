/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';
import { PeopleService } from '../../providers/people/people.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute, MockRouter } from '../../mocks/routes';
import { MockPeopleService } from '../../mocks/people.service';

describe('SearchComponent', () => {

  let mockPeopleService: MockPeopleService;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {

    mockPeopleService = new MockPeopleService();
    mockActivatedRoute = new MockActivatedRoute({ 'term': 'peyton' });
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule]
    });

  });

  it('search component is running', () => {
    let fixture = TestBed.createComponent(SearchComponent);
    let component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
