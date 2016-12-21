import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { MapComponent } from '../../components/map/map.component';
import { People } from '../../models/people';
import { Position } from '../../models/position';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  providers: [PeopleService]
})
export class PeopleComponent implements OnInit {

  public people: People;
  public itsMe: boolean;
  public showMap: boolean;
  public position: Position;
  private paramsSub = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {

    this.paramsSub = this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.peopleService.getPeopleById(params.id).then((people: People) => {
          this.resetPeople();
          this.people = people;
          this.peopleService.verifyItsMe(people).then((result: boolean) => {
            this.itsMe = result;
          })
        });
      }
    });

  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  resetPeople() {
    this.people = null;
    this.showMap = false;
  }

  onIdentify() {
    this.itsMe = true;
    this.peopleService.defineMe(this.people);
  }

  onShowMap() {
    this.showMap = true;
  }

  updatePosition(ev: Position) {
    this.position = ev;
  }

  onUpdate() {
    this.people.lastPosition = this.position;
    this.peopleService.update(this.people).then((res) => { })
  }

}
