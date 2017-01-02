import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { MapComponent } from '../../components/map/map.component';
import { MyInventoryComponent } from '../../components/my-inventory/my-inventory.component';
import { InventoryComponent } from '../../components/inventory/inventory.component';
import { People } from '../../models/people';
import { Position } from '../../models/position';
import { GenderPipe } from '../../pipes/gender/gender.pipe';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html'
})
export class PeopleComponent implements OnInit, OnDestroy {

  public people: People;
  public itsMe: boolean;
  public showMap: boolean;
  public position: Position;
  private paramsSub: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {

    // subscribe for params change
    this.paramsSub = this.route.params.subscribe((params: any) => {
      if (params.id) {

        // get people by id
        this.peopleService.getPeopleById(params.id).then((people: People) => {

          // clear current profile
          this.clearPeople();
          this.people = people;

          // verify survivor infected param
          if (params.infected && params.infected === 'true') {
            this.people.infected = true;
          };

          // verify if the profile is me
          this.peopleService.verifyItsMe(people).then((result: boolean) => {
            this.itsMe = result;
          });
        });
      }
    });

  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  clearPeople() {
    this.people = null;
    this.showMap = false;
  }

  onIdentify() {
    if (confirm(`You really is the ${this.people.name}?`)) {
      this.itsMe = true;
      this.peopleService.defineMe(this.people);
    }
  }

  onShowMap() {
    this.showMap = true;
  }

  updatePosition(ev: Position) {
    this.position = ev;
  }

  onUpdate() {
    this.people.lastPosition = this.position;
    this.peopleService.update(this.people).then((res) => { });
  }

}
