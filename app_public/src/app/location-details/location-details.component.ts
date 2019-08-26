/**
 * Component that contains and displays details of a single location.
 * Like the home-list component
 */
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../home-list/home-list.component';
import { Loc8rDataService } from '../loc8r-data.service'; // for POST api call on a new review

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

  constructor(private loc8rDataService: Loc8rDataService) { }

  ngOnInit() {
  }
  public formError: string;

  private resetAndHideReviewForm(): void {
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  /**
   * Checks if all fields in the form have content
   */
  private formIsValid(): boolean {
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handler to validate form data, and make api call using service
   */
  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then(review => {
          //console.log('Review saved', review);
          let reviews = this.location.reviews.slice(0);
          reviews.unshift(review);
          this.location.reviews = reviews;
          this.resetAndHideReviewForm();
        });
    } else {
      this.formError = 'All fields required, please try again';
    }
  }

}
