import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { People } from '../../models/people';
import { Position } from '../../models/position';
import { Config } from '../../config';

@Injectable()
export class PeopleService {

  private headers: Headers;

  constructor(
    private http: Http,
    private localStorage: LocalStorageService
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
      `person[lonlat]=POINT (${params.lastPosition.latitude} ${params.lastPosition.longitude})`,
      `items=${inventory}`,
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.post(Config.api_post_people, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(this.processPeople(res.json())) },
        (err) => { reject(err.json()) }
        );
    });

  }

  update(people: People) {

    let data: Array<string> = [
      `person[name]=${people.name}`,
      `person[age]=${people.age}`,
      `person[gender]=${people.gender}`,
      `person[lonlat]=POINT (${people.lastPosition.latitude} ${people.lastPosition.longitude})`
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.patch(`${Config.api_patch_people}${people.id}.json`, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(this.processPeople(res.json())) },
        (err) => { reject(err.json()) }
        );
    });
  }

  processPeople(data: any) {
    return new People(
      data.id,
      data.name,
      data.age,
      data.gender,
      this.convertPoint2Location(data.lonlat)
    );
  }

  convertPoint2Location(point) {
    let data = point.replace('POINT (', '').replace(')', '').split(' ');
    return new Position(data[0], data[1]);
  }

  getPeopleById(id: number) {
    return new Promise((resolve, reject) => {

      this.http.get(`${Config.api_get_people}${id}.json`).subscribe(
        (res) => { resolve(this.processPeople(res.json())) },
        (err) => { reject() })
    })
  }

  defineMe(people: People) {
    this.localStorage.set('profile', JSON.stringify(people));
  }

  verifyItsMe(people: People) {
    return new Promise((resolve) => {

      let profile: any = this.localStorage.get('profile');

      if (profile) {
        let json = JSON.parse(profile);

        if (json.id == people.id) {
          resolve(true);
        } else {
          resolve(false)
        }
      }

    })
  }

}
