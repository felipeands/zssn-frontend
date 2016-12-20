import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../../config';

@Injectable()
export class PeopleService {

  private headers: Headers;

  constructor(
    private http: Http
  ) { }

  setHeaders() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.headers;
  }

  add(params: any) {

    let inventory = [
      `Ammunition:${params.Ammunition}`,
      `Food:${params.Food}`,
      `Medication:${params.Medication}`,
      `Water:${params.Water}`
    ].join(';');

    let data: Array<string> = [
      `person[name]=${params.name}`,
      `person[age]=${params.age}`,
      `person[gender]=${params.gender}`,
      `person[lonlat]=point(${params.lastPosition.latitude}, ${params.lastPosition.longitude})`,
      `items=${inventory}`,
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.post(Config.api_post_people, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(res.json()) },
        (err) => { reject(err.json()) }
        );

    });

  }

}
