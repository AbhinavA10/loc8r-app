import { Component, OnInit } from '@angular/core';//imports what it needs from angular

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

  constructor() { }
  locations: Location[] = [{
    _id: '590d8dc7a7cb5b8e3f1bfc48',
    name: 'Costy',
    distance: 14000.1234,
    address: 'High Street, Reading',
    rating: 3,
    facilities: ['hot drinks', 'food', 'power']
    }, {
    _id: '590d8dc7a7cb5b8e3f1bfc48',
    name: 'Starcups',
    distance: 120.542,
    address: 'High Street, Reading',
    rating: 5,
    facilities: ['wifi', 'food', 'hot drinks']
    }];

  ngOnInit() {
  }

}