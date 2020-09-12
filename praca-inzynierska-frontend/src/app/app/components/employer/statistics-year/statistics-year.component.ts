import { Component, Input, OnInit } from '@angular/core';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { StatisticsYearDto } from 'src/app/app/model/dto/StatisticsYearDto';
import { StatisticsService } from '../../../services/statistics.service'

@Component({
  selector: 'statistics-year',
  templateUrl: './statistics-year.component.html',
  styleUrls: ['./statistics-year.component.scss']
})
export class StatisticsYearComponent implements OnInit {

  _year: number
  get year(): number {
    return this._year
  }
  @Input('year')
  set year(val: number) {
    this._year = val
    this.onYearChange(val)
  }

  statisticsLoaded: boolean =  false
  statistics: StatisticsYearDto

  constructor(
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
  }

  private onYearChange(newYear: number) {
    this.statisticsLoaded = false
    this.statisticsService.getYearStatistics(newYear).subscribe(newStatistics => {
      newStatistics.sort()
      this.statistics = newStatistics
      this.statisticsLoaded = true
    })
  }

}
