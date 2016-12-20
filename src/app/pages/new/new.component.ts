import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../../providers/people/people.service';
import { MapComponent } from '../../components/map/map.component';

import { Position } from '../../models/position';

declare var google: any;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  providers: [PeopleService]
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
  ) { }

  ngOnInit() { }

  onSubmit(form: any) {

    this.submitted = true;
    form.value.lastPosition = this.position;

    this.peopleService.add(form.value).then((res: any) => {
      this.submitted = false;
      console.log('res', res);
    }, (err) => {
      this.submitted = false;
    });

  }

  updatePosition(ev) {
    this.position = ev;
  }

}
