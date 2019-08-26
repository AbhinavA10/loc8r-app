// this is the module definition. It tells what componenets are compiled into this modoule

// import pieces of angular functionality that the app will use
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router'; // use Angular's router to navigate between pages in this SPA

//import components that the app will use
import { FrameworkComponent } from './framework/framework.component';
import { HomeListComponent } from './home-list/home-list.component';
import { DistancePipe } from './distance.pipe';
import { AboutComponent } from './about/about.component';

// Describe module using a decorator
// Decorator: 
@NgModule({
  declarations: [
    HomeListComponent,
    DistancePipe,
    FrameworkComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      // paths do not contain leading or trailing slashes, and we leave out anything defined in index.html's 'base href'
      // this is where we define our routes
      {
        path: '', //homepage route
        component: HomeListComponent // use this component for the route defined in above line
      },
      {
        path: 'about',
        component: AboutComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [FrameworkComponent] //FrameworkComponent is the entry point of application, and holds the navigation
})

//export the module
export class AppModule { }
