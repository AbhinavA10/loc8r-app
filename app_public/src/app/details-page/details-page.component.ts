/**
 * Component for the Details page
 * Like the homepage component
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// ActivatedRoute -> get the value of the current route from inside the component
//ParamMap -> get url paramters of current route, returns an observable
import { Loc8rDataService } from '../loc8r-data.service'; // since all 3 sub components need data of the location, we make api call here
import { Location } from '../location';
import { switchMap } from 'rxjs/operators'; // get values from ParamMap observable and use to call the api by second observable

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  constructor(
    private loc8rDataService: Loc8rDataService,
    private route: ActivatedRoute
  ) { }
  newLocation: Location;

  ngOnInit(): void {
    // this will get id of location from url, and turn it into location data by calling the api
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let id = params.get('locationId'); // when paramMap observable returns a ParamMap, get the id (url paramter)
          return this.loc8rDataService.getLocationById(id);
        })
      ).subscribe((newLocation: Location) => { // getLocationById observable finishes, 
        this.newLocation = newLocation;
        //console.log(newLocation);
        this.pageContent.header.title = newLocation.name;
        this.pageContent.sidebar = `${newLocation.name} is on Loc8r
        because it has accessible wifi and space to sit down with
        your laptop and get some work done.\n\nIf you\'ve been and
        you like it - or if you don\'t - please leave a review to
        help other people just like you.`;
      });
  }

  /**
   * Content to pass into sub components
   */
  public pageContent = {
    header: {
      title: '',
      strapline: ''
    },
    sidebar: ''
  };

}
