import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { People } from '../../models/people';
import { Position } from '../../models/position';
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
      `person[lonlat]=${this.convertLocation2Point(params.lastPosition)}`,
      `items=${inventory}`,
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.post(`${Config.api_people}.json`, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(this.processPeople(res.json())); },
        (err) => { reject(err.json()); }
        );
    });

  }

  update(people: People) {

    let data: Array<string> = [
      `person[name]=${people.name}`,
      `person[age]=${people.age}`,
      `person[gender]=${people.gender}`,
      `person[lonlat]=${this.convertLocation2Point(people.lastPosition)}`
    ];

    return new Promise((resolve, reject) => {

      this.setHeaders();
      this.http.patch(`${Config.api_people}/${people.id}.json`, data.join('&'), {
        headers: this.headers
      }).subscribe(
        (res) => { resolve(this.processPeople(res.json())); },
        (err) => { reject(err.json()); }
        );

    });
  }

  processPeople(data: any) {

    if (!data.id && data.location) {
      data.id = this.convertUrlLocation2Id(data.location);
    }

    let people: People = new People(
      data.id,
      data.name,
      data.age,
      data.gender,
      this.convertPoint2Location(data.lonlat)
    );

    if (data['infected?']) { people.infected = data['infected?']; }

    return people;
  }

  processPeoples(data: Array<any>) {
    return data.map((people) => {
      return this.processPeople(people);
    });
  }

  convertPoint2Location(point) {
    if (point) {
      let data = point.replace('POINT (', '').replace(')', '').split(' ');
      return new Position(data[0], data[1]);
    } else {
      return null;
    }
  }

  convertUrlLocation2Id(url: string) {
    return url.replace(`${Config.api_people}/`, '');
  }

  convertLocation2Point(location: Position) {
    return `POINT (${location.latitude} ${location.longitude})`;
  }

  getPeopleById(id: number) {
    return new Promise((resolve, reject) => {

      this.http.get(`${Config.api_people}/${id}.json`).subscribe(
        (res) => { resolve(this.processPeople(res.json())); },
        (err) => { reject(); }
      );
    });
  }

  defineMe(people: People) {
    localStorage.setItem('profile', JSON.stringify(people));
  }

  verifyItsMe(people: People) {
    return new Promise((resolve) => {

      let profile: any = this.getMyLocalProfile();

      if (profile) {
        if (profile.id === people.id) {
          resolve(true);
        } else {
          resolve(false);
        }
      }

    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.http.get(`${Config.api_people}.json`).subscribe(
        (res) => { resolve(this.processPeoples(res.json())); },
        (err) => { reject(); }
      );
    });
  }

  getMyLocalProfile() {
    let data: any = localStorage.getItem('profile');
    return (data) ? JSON.parse(data) : null;
  }

}
