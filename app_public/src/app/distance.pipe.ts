/**
 * Custom Pipe to format location distance
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  // function accepts paramter value of the 'number' type, and returns a string. No additional arguments are accepted
  transform(distance: number): string {
    const isNumeric = function (n) { // helper function is inside transform function
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    if (distance && isNumeric(distance)) {
      let thisDistance = '0';
      let unit = 'm';
      if (distance > 1000) {
        thisDistance = (distance / 1000).toFixed(1);
        unit = 'km';
      } else {
        thisDistance = Math.floor(distance).toString();
      }
      return thisDistance + unit;
    } else {
      return '?';
    }
  }

}
