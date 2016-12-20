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
  public submitted: boolean;

  public inventoryOptions: Array<string> = [
    'Ammunition',
    'Food',
    'Medication',
    'Water'
  ];
  public genderOptions: Array<any> = [
    { name: 'Female', value: 'f' },
    { name: 'Man', value: 'm' }
  ];

  public position: Position;

  constructor(
    private peopleService: PeopleService,
  ) { }

  ngOnInit() { }

  onSubmit(form: any) {
    this.submitted = true;

    this.peopleService.add(form.value).then((res: any) => {
      this.submitted = false;
      console.log('res', res);
    }, (err) => {
      this.submitted = false;
    });

  }

  updatePosition(ev) {
    console.log(ev);
    this.position = ev;
  }

}
