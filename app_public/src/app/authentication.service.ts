// service to read and write a JWT into localStorage
import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from './storage'; // our interface with localStorage
import { User } from './user';
import { AuthResponse } from './authresponse';
import { Loc8rDataService } from './loc8r-data.service'; // need to use our Node.js api to login and register

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(@Inject(BROWSER_STORAGE) private storage: Storage,
    private loc8rDataService: Loc8rDataService) { }

  /**
   * Gets JWT from LocalStorage
   */
  public getToken(): string {
    return this.storage.getItem('loc8r-token');
  }

  /**
   * Saves JWT into localStorage
   * @param token JWT to save
   */
  public saveToken(token: string): void {
    this.storage.setItem('loc8r-token', token);
  }

  /**
   * Wrapper for api service to login
   * @param user 
   */
  public login(user: User): Promise<any> {
    return this.loc8rDataService.login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token)); // save JWT
      //TODO: what if credentials entered are incorrect?
  }

  /**
   * Wrapper to register with the api
   * @param user 
   */
  public register(user: User): Promise<any> {
    return this.loc8rDataService.register(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token)); // save JWT
    //TODO: what happens if user already exists?
  }

  /**
   * To logout of the application, simply remove JWT from local storage
   */
  public logout(): void {
    this.storage.removeItem('loc8r-token');
  }

  /**
   * Determines whether a user is logged in into the web app
   * Based on JWT exisistance and expiry
   */
  public isLoggedIn(): boolean {
    const token: string = this.getToken(); // get JWT from localStorage
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // decode the JWT, and retrieve the payload
      return payload.exp > (Date.now() / 1000); // determine if JWT has expired yet.
    } else { // JWT didn't exist, so user is not logged in
      return false;
    }
  }

  /**
   * Get user email and name from JWT
   */
  public getCurrentUser(): User {
    if (this.isLoggedIn()) { // make sure user is still logged in
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1])); // get email and name fields from payload of JWT
      return { email, name } as User; // cast types for typescript
    }
  }
}