// this is the module definition. It tells what componenets are compiled into this modoule

// import pieces of angular functionality that the app will use
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//import components that the app will use
import { HomeListComponent } from './home-list/home-list.component';
import { DistancePipe } from './distance.pipe';

// Describe module using a decorator
// Decorator: 
@NgModule({
  declarations: [
    HomeListComponent,
    DistancePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [HomeListComponent] //HomeListComponent is the entry point of application
})

//export the module
export class AppModule { }
