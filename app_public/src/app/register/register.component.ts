import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public formError: string = ''; // used when registration has errors
  public credentials = { // view is binded to this
    name: '',
    email: '',
    password: ''
  };
  public pageContent = {
    header: {
      title: 'Create a new account',
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
  public onRegisterSubmit(): void {
    this.formError = '';
    if (
      !this.credentials.name ||
      !this.credentials.email || //TODO: validate that it is actually an email
      !this.credentials.password
    ) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doRegister();
    }
  }

  /**
   * Calls authentication service to register
   */
  private doRegister(): void {
    this.authenticationService.register(this.credentials) // we can still send the credentials object as a User type
      .then(() => {
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      })
      .catch((message) => this.formError = message);
  }
}
