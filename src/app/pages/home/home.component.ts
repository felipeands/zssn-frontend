import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { People } from '../../models/people';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public profile: People;

  constructor(
    private router: Router,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    this.profile = this.peopleService.getMyLocalProfile();
  }

  onOpenProfile() {
    this.router.navigate(['/people', this.profile.id]);
  }

}
