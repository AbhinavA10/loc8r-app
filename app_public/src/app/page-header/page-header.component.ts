import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  // content is an input to this component as it is passed in from higher-level components
  @Input() content: any; // define content as class member that accepts any type of input

  constructor() { }

  ngOnInit() {
  }

}
