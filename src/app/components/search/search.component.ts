import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { People } from '../../models/people';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private peoples: Array<People>;
  public results: Array<People>;
  public valueModel: string;
  public isSearching: boolean;
  private searchQueue: string;

  constructor(
    private peopleService: PeopleService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onGetPeoples() {
    return new Promise((resolve) => {
      if (!this.isSearching && !this.peoples) {
        this.isSearching = true;
        this.peopleService.getAll().then((peoples: Array<People>) => {
          peoples.reverse();
          this.peoples = peoples;
          this.isSearching = false;
          this.processQueue();
          resolve();
        })
      } else {
        resolve();
      }
    })
  }

  onChange(ev) {
    if (this.valueModel && this.valueModel.length > 1) {

      if (this.isSearching) {
        this.searchQueue = this.valueModel;
      } else {
        this.search(this.valueModel);
      }

    } else if (this.valueModel.length <= 1) {
      this.resetResults();
    }
  }

  processQueue() {
    if (this.searchQueue) {
      this.search(this.searchQueue);
      this.searchQueue = null;
    }
  }

  search(value: string) {
    this.resetResults();
    this.results = this.peoples.filter((people: People) => {
      if (people && people.name.match(new RegExp(value, 'i'))) {
        return people;
      }
    })
  }

  resetResults() {
    this.results = null;
  }

  resetSearch() {
    this.resetResults();
    this.valueModel = null;
  }

  onOpenPeople(people: People) {
    this.resetSearch();
    this.router.navigate(['/people', people.id]);
  }

}
