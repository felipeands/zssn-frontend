import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../../providers/people/people.service';

import { Position } from '../../models/position';

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

  public inventoryOptions: Array<any> = [
    'Ammunition',
    'Food',
    'Medication',
    'Water'
  ];

  public genderOptions: Array<any> = [
    { name: 'Female', value: 'f' },
    { name: 'Man', value: 'm' }
  ];

  constructor(
    private peopleService: PeopleService
  ) { }

  ngOnInit() { }

  onSubmit(form: any) {
    this.submitted = true;

    this.peopleService.add(form.value).then((res: any) => {
      setTimeout(() => {
        this.submitted = false;
      }, 2000);
    }, (err) => {
      this.submitted = false;
    });

  }

}
