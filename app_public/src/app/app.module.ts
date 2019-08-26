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
import { HomepageComponent } from './homepage/homepage.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HtmlLineBreaksPipe } from './html-line-breaks.pipe';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { MostRecentFirstPipe } from './most-recent-first.pipe';

// Describe module using a decorator
// Decorator: 
@NgModule({
  declarations: [
    HomeListComponent,
    DistancePipe,
    FrameworkComponent,
    AboutComponent,
    HomepageComponent,
    PageHeaderComponent,
    SidebarComponent,
    HtmlLineBreaksPipe,
    RatingStarsComponent,
    LocationDetailsComponent,
    DetailsPageComponent,
    MostRecentFirstPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      // paths do not contain leading or trailing slashes, and we leave out anything defined in index.html's 'base href'
      // this is where we define our routes
      {
        path: '', //homepage route
        component: HomepageComponent // use this component for the route defined in above line
      },
      {
        // the about page
        path: 'about',
        component: AboutComponent
      },
      {
        // for detail page of each location
        path: 'location/:locationId',
        component: DetailsPageComponent
        }
    ])
  ],
  providers: [],
  bootstrap: [FrameworkComponent] //FrameworkComponent is the entry point of application, and holds the navigation
})

//export the module
export class AppModule { }
