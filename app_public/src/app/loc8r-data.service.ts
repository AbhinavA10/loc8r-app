/**
 *  Service to interact with API
 * Services work in the background
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; //inject http service into this service so we can make requests to api
import { Location } from './home-list/home-list.component'; // location class, from home component

@Injectable({ // Decorator that marks a class as available to be provided and injected as a dependency.
  providedIn: 'root'
  // the above takes the place of explcitily listing services in the providers array of app module
})
export class Loc8rDataService {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { } //Angular manages dependancy injection using constructor

  /**
   * Make GET Request to API for nearby locations
   */
  public getLocations(): Promise<Location[]> {
    const lng: number = -80.492531;
    const lat: number = 43.451637;
    const maxDistance: number = 20;
    //build url to call the api at
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    return this.http
      .get(url) // make http api call with GET
      .toPromise() // convert Angular's 'Observable' to a 'Promise'
      .then(response => response as Location[]) // convert response to a json object typed location
      .catch(this.handleError);
  }
  
  /**
   * Error Handler
   * @param error 
   */
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
