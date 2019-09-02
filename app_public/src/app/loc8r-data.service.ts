/**
 * Service to interact with API
 * Services work in the background
 */

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; //inject http service into this service so we can make requests to api
import { Location, Review } from './location';// location class,
import { environment } from '../environments/environment';
import { User } from './user';
import { AuthResponse } from './authresponse';
import { BROWSER_STORAGE } from './storage';

@Injectable({ // Decorator that marks a class as available to be provided and injected as a dependency.
  providedIn: 'root'
  // the above takes the place of explcitily listing services in the providers array of app module
})
export class Loc8rDataService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage // need to import localStorage so we can retreive token for api calls
  ) { } //Angular manages dependancy injection using constructor

  /**
   * Make GET Request to API for nearby locations
   */
  public getLocations(lat: number, lng: number): Promise<Location[]> {
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
   * Make GET Request to API for details on a specific location
   */
  public getLocationById(locationId: string): Promise<Location> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;
    return this.http
      .get(url) // make http api call with GET
      .toPromise() // convert Angular's 'Observable' to a 'Promise'
      .then(response => response as Location) // convert response to a json object typed location
      .catch(this.handleError);
  }

  /**
   * Make POST Request to API to add a new review
   */
  public addReviewByLocationId(locationId: string, formData: any): Promise<Review> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}/reviews`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.storage.getItem('loc8r-token')}` }) // add jwt to header
    }
    return this.http
      .post(url, formData, httpOptions)
      .toPromise()
      .then(response => response as Review)
      .catch(this.handleError);
  }

  /**
   * Error Handler
   * @param error 
   */
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    if (error.error.message) {
      return Promise.reject(error.error.message);
    }
    return Promise.reject(error.message || error);
  }

  /**
   * Used on login
   * @param user 
   */
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  /**
   * Used on registration
   * @param user 
   */
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  /**
   * Makes a POST request for Authentication routes in the API
   * As login and registration are similar, we seperate this repeated code out.
   * @param urlPath 
   * @param user 
   */
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse) // response during login or registration will be a JWT
      .catch(this.handleError);
  }
}
