/**
 * Component that contains and displays details of a single location.
 * Like the home-list component
 */
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../home-list/home-list.component';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;
  public googleAPIKey: string = "null"; // Google Maps API Key
  public formVisible: boolean = false;
  public newReview = {
    author: '',
    rating: 5,
    reviewText: ''
  };

  constructor() { }

  ngOnInit() {
  }

}
