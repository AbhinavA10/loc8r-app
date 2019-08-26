# Loc8rPublic
Angular Front end for our application

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
```
ng build --prod --output-path build
```


## Notes
- In Angular, double curly brackets are used to denote a binding between the data and the view. 
- The value is probably defined in the ts file for the same component.
- component to control the services rather than perform the functions.
- any code that’s interacting with APIs, running logic, or performing operations should be externalized into services

### Angular Decorators
https://ultimatecourses.com/blog/angular-decorators

### If-else In Html Bindings for Angular
Angular's if-else logic is like a `switch` statement in javascript
- `[ngSwitch]` binding defines the condition to switch on
- `*ngSwitchCase` directive provides the specific value/case to check against
- `*ngSwitch-Default` is the default case

Example:
```html
<p class="card-text" *ngFor="let time of location.openingTimes"[ngSwitch]="time.closed">
       {{ time.days }} :
    <span *ngSwitchCase="true">Closed</span>
    <span *ngSwitchDefault>{{ time.opening + " - " + time.closing}}</span>
</p>
```