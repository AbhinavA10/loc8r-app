import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service'; // needed so we can login and logout from the base page
import { HistoryService } from '../history.service';
import { User } from '../user';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css']
})
export class FrameworkComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private historyService: HistoryService) // inject imported service
  { }

  ngOnInit() {
  }
  /**
   * Called when the logout button is clickd
   * Tells the authentication service to log the user out
   */
  public doLogout(): void {
    this.authenticationService.logout();
  }

  /**
   * Wrapper to determine if user is logged in
   */
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  /**
   * Returns the username of the user
   */
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    return user ? user.name : 'Guest';
  }
}
