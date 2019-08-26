import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }
  public getPosition(cbSuccess, cbError, cbNoGeo): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError); // call native HTML5/JS function
    } else {
      // if geolocation is not supported
      cbNoGeo();
    }
  }
}
