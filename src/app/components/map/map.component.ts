import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Position } from '../../models/position';
import { Config } from '../../config';

declare var google: any;
declare var navigator: any;
declare var window: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Output("position") positionEvent: EventEmitter<any> = new EventEmitter();

  public mapInitialized: boolean;
  public latLng: any;
  public map: any;
  public marker: any;
  public position: Position;
  
  constructor() { }

  ngOnInit() {
    return new Promise((resolve) => {
      this.loadMap();
      this.waitGoogleMaps().then((win) => {
        this.getUpdatedPos().then((latLng: any) => {
          this.updatePosition(latLng.latitude, latLng.longitude);
          this.initMap();
          this.addMarker(this.latLng);
          resolve();
        })
      });
    });
  }

  loadMap() {
    let sdk = this.loadSdk();
    if (sdk == false) {
      window.initMap();
    }
  }

  loadSdk() {
    let mapScript = document.getElementById('mapscript');
    if (mapScript == undefined) {
      let script = document.createElement('script');
      script.id = 'mapscript';
      script.type = 'text/javascript';
      script.src = `http://maps.google.com/maps/api/js?key=${Config.gmaps_key}${Config.gmaps_sensor}&callback=initMap`;
      document.body.appendChild(script);
      return true;
    } else {
      return false;
    }
  }

  waitGoogleMaps() {
    return new Promise(resolve => {
      window['initMap'] = () => {
        resolve(window);
      }
    });
  }

  getUpdatedPos() {
    let options = {
      timeout: Config.gmaps_timeout,
      enableHighAccuracy: Config.gmaps_accuracy
    };

    return new Promise((resolve, reject) => {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.updatePosition(pos.coords.latitude, pos.coords.longitude);
          resolve(pos.coords);
        })
      } else {
        reject();
      }

    });
  }

  updatePosition(latitude, longitude) {
    return new Promise((resolve) => {
      this.latLng = new google.maps.LatLng(latitude, longitude);
      this.addPosition(latitude, longitude);
      this.mapInitialized = true;
      resolve();
    });
  }

  initMap() {
    let mapOptions = {
      center: this.latLng,
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  addMarker(latLng) {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      draggable: true
    });

    let t = this;

    this.marker.addListener('dragend', function (e) {
      t.updatePosition(e.latLng.lat(), e.latLng.lng());
    });
  }

  addPosition(latitude, longitude) {
    this.position = {
      latitude: latitude,
      longitude: longitude
    };
    this.positionEvent.emit(this.position);
  }

  updateMarker() {
    this.marker.setPosition(this.latLng);
    this.map.setCenter(this.latLng);
  }

  onGetCurPos() {
    this.mapInitialized = false;
    this.getUpdatedPos().then(() => {
      this.map.setCenter(this.latLng);
      this.updateMarker();
    })
  }

}
