import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mostRecentFirst'
})
export class MostRecentFirstPipe implements PipeTransform {

  /**
   * Compares the dates of two entries in an array
   * @param a Element i in the array
   * @param b Element j in the array
   */
  private compare(a, b) {
    const createdOnA = a.createdOn;
    const createdOnB = b.createdOn;
    let comparison = 1; // change the order
    if (createdOnA > createdOnB) // a is more recent than b
      comparison = -1; // leave the order of the elements as is
    return comparison;
  }

  transform(reviews: any[]): any[] {
    if (reviews && reviews.length > 0) {
      return reviews.sort(this.compare); // use javascript's sort function to sort the array  
    }
    return null;
  }

}
