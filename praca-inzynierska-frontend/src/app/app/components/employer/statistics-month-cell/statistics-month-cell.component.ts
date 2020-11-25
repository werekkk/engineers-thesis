import { Component, Input, OnInit } from '@angular/core';
import { StatisticsDto } from 'src/app/app/model/dto/StatisticsDto';

@Component({
  selector: 'statistics-month-cell',
  templateUrl: './statistics-month-cell.component.html',
  styleUrls: ['./statistics-month-cell.component.scss']
})
export class StatisticsMonthCellComponent {

  @Input()
  monthStatistics: StatisticsDto

  constructor() { }

}
