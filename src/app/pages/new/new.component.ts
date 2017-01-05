import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeopleService } from '../../providers/people/people.service';
import { MapComponent } from '../../components/map/map.component';
import { Position } from '../../models/position';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit {

  public nameModel: string;
  public ageModel: number;
  public genderModel: string;
  public lastPositionModel: Position;
  public inventoryModel: Array<number> = [0, 0, 0, 0];
  public position: Position;
  public submitted: boolean;

  public genderOptions: Array<any> = [
    { name: 'Female', value: 'F' },
    { name: 'Man', value: 'M' }
  ];
  public inventoryOptions: Array<string> = [
    'Ammunition',
    'Food',
    'Medication',
    'Water'
  ];

  constructor(
    private peopleService: PeopleService,
    private router: Router
  ) { }

  ngOnInit() { }

  onSubmit(form: any) {

    this.submitted = true;
    form.value.lastPosition = this.position;

    this.peopleService.add(form.value).then((people: any) => {
      this.submitted = false;
      this.router.navigate(['/people', people.id]);
    }, (err) => {
      alert('It was not possible to register the survivor!');
      this.submitted = false;
    });

  }

  updatePosition(ev) {
    this.position = ev;
  }

}
