/**
 * This file contains custom data structures
 */

class OpeningTimes {
    days: string;
    opening: string;
    closing: string;
    closed: boolean;
}

export class Review {
    author: string;
    rating: number;
    reviewText: string;
}

/**
 * Data structure that models a single location's data
 */
export class Location {
    // each object that is defined with the clas 'Location' must have a value for each of the above fields.
    _id: string;
    name: string;
    distance: number;
    address: string;
    rating: number;
    facilities: string[];
    reviews: Review[];
    coords: number[];
    openingTimes: OpeningTimes[];

}