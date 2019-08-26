import { Component, OnInit } from '@angular/core'; //imports what it needs from angular
import { Loc8rDataService } from '../loc8r-data.service'; // import api caller service
import { GeolocationService } from '../geolocation.service'; // import api caller service  

/**
 * Data structure that models a single location's data
 */
export class Location {
  _id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  facilities: string[];
  // each object that is defined with the clas 'Location' must have a value for each of the above fields.
}

//decorate the component -> give information the app needs to run this component
@Component({
  selector: 'app-home-list',// html tag to place the contents of this component/html inside
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})


//export component as a class
export class HomeListComponent implements OnInit {

  constructor(
    private loc8rDataService: Loc8rDataService,
    private geolocationService: GeolocationService) { } // inject our api services

  public message: string; // message to display to user while retrieving user's location and list of locations
  public locations: Location[]; // whenever this value is updated, the html will automatically be updated

  /**
   * Make request to api using service for list of locations nearby
   */
  private getLocations(position: any): void {
    console.log(position)
    this.message = 'Searching for nearby places';
    const lat: number = position.coords.latitude; //extract coords
    const lng: number = position.coords.longitude;
    this.loc8rDataService
      .getLocations(lat, lng)
      .then(foundLocations => {
        this.message = foundLocations.length > 0 ? '' : 'No locations found';
        this.locations = foundLocations;
      });
  }

  /**
   * Error callback when geolocation returns an error
   * @param error 
   */
  private showError(error: any): void {
    this.message = error.message;
  };

  /**
   * Callback for when geolocation is not supported
   */
  private noGeo(): void {
    this.message = 'Geolocation not supported by this browser.';
  };

  /**
   * Find user's location, and handle response appropriately
   */
  private getPosition(): void {
    this.message = 'Getting your location...';
    this.geolocationService.getPosition(
      this.getLocations.bind(this), // if successful, make api request for list of nearby locations
      this.showError.bind(this), // bind context of 'this' to the callback
      this.noGeo.bind(this));
  }
  ngOnInit() {
    // this hook is called when this component is fully initialized
    this.getPosition();
  }

}