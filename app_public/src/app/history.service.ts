/**
 * Keeps track of visited pages, using Angular's Router's events properties
 * The events property keeps a record of routing events
 */

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// NavigationEnd events is an event that is triggered once the redirects etc. are complete
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private urls: string[] = [];

  constructor(private router: Router) {
    this.router.events // events property returns Observable of many event types
      .pipe(filter(routerEvent => routerEvent instanceof NavigationEnd)) // but we are interested only in NavigationEnd events
      .subscribe((routerEvent: NavigationEnd) => {
        const url = routerEvent.urlAfterRedirects;
        //console.log(url);
        this.urls = [...this.urls, url]; // append the urls to our array, such that required updates are notified
      });
  }

  /**
   * Returns the url of the last visited page
   */
  public getPreviousUrl(): string {
    const length = this.urls.length;
    return length > 1 ? this.urls[length - 2] : '/'; // length-1 would have /login/ or /register/
  }

  /**
   * Returns the last url visted excluding /login or /register
   * In case a user navigates between /login and /register a couple of times
   */
  public getLastNonLoginUrl(): string {
    const exclude: string[] = ['/register', '/login'];
    const filtered = this.urls.filter(url => !exclude.includes(url));
    const length = filtered.length;
    return length > 1 ? filtered[length - 1] : '/';
  }
}
