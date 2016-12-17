import { Component, OnInit } from '@angular/core';
import { SurvivorService } from '../../providers/survivor/survivor.service';

import { Position } from '../../models/position';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  providers: [SurvivorService]
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
    private survivorService: SurvivorService
  ) { }

  ngOnInit() { }

  onSubmit(form: any) {
    this.submitted = true;

    console.log(form);

    this.survivorService.add(form.value).then((res: any) => {
      setTimeout(() => {
        this.submitted = false;
      }, 2000);
    }, (err) => {
      this.submitted = false;
    });

  }

}
