import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public formError: string = ''; // used when registration has errors
  public credentials = { // view is binded to this
    name: '', // name field is left here so we can cast 'credentials' to a type 'User' object, with the extra field of password
    email: '',
    password: ''
  };
  public pageContent = {
    header: {
      title: 'Sign in to Loc8r',
      strapline: ''
    },
    sidebar: ''
  };
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService
  ) { }
  ngOnInit() {
  }

  /**
   * Called when the submit button is clicked
   * Wrapper to make sure all fields are provided
   */
  public onLoginSubmit(): void {
    this.formError = '';
    if (
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  /**
   * Calls authentication service to register
   */
  private doLogin(): void {
    this.authenticationService.login(this.credentials) // we can still send the credentials object as a User type
      .then(() => {
        console.log(this.historyService.getLastNonLoginUrl());
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      })
      .catch(
        (message) => {
          console.log('message');
          console.log(message)
          this.formError = message
        });
  }
}
