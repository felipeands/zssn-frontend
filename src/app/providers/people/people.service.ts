import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

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
      `name=${params.name}`,
      `age=${params.age}`,
      `gender=${params.gender}`,
      `items=${inventory}`
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.post('http://localhost:3000/gallery/add', data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(res.json()) },
        (err) => { reject(err.json()) }
        );

    });

  }

}
