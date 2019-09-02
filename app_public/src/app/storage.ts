//Hook into localStorage via a factory service
// this will be injected into components that require access to localStorage

import { InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => localStorage // factory design pattern for localStorage
    // Factory design pattern allows us to create instances of an object without knowing details of that object
    // i.e. a constructor for a class, without explicitly calling the constructor. This allows us to 
    // this would allow us to return an instance of a subclass from the factory instead
});