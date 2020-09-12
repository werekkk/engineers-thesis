import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {

  year: number = new Date().getFullYear()

  constructor() { }

}
