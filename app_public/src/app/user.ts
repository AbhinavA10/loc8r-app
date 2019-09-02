// Holds info about the user
// Created to help manage data across the application

export class User {
    email: string;
    name: string;
    //password: string; // this field is not defined here as it would then be required wherever User is used.
    // but we dont want to save the users password!
}