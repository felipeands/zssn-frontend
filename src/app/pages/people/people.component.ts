import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { People } from '../../models/people';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  providers: [PeopleService]
})
export class PeopleComponent implements OnInit {

  public people: People;
  public itsMe: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    if (this.route.params['value'].id) {
      this.peopleService.getPeopleById(this.route.params['value'].id).then((people: People) => {
        this.people = people;
      });
    }
  }

  onIdentify() {
    this.itsMe = true;
  }

}
