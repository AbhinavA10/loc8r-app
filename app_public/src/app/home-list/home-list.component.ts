import { Component, OnInit } from '@angular/core'; //imports what it needs from angular
import { Loc8rDataService } from '../loc8r-data.service'; // import api caller service

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

  constructor(private loc8rDataService: Loc8rDataService) { } // inject our api services
  public locations: Location[]; // whenever this value is updated, the html will automatically be updated
  /**
   * Make request to api using service for list of locations nearby
   */
  private getLocations(): void {
    this.loc8rDataService
      .getLocations()
      .then(foundLocations => { this.locations = foundLocations; });
  }

  ngOnInit() {
    // this hook is called when this component is fully initialized
    this.getLocations();
  }

}