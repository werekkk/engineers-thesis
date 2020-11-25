import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { StatisticsYearDto } from 'src/app/app/model/dto/StatisticsYearDto';
import { Utils } from 'src/app/app/shared/utils/utils';
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
  @Input()
  set year(val: number) {
    this._year = val
    this.onYearChange(val)
  }

  statisticsLoaded: boolean =  false
  statistics: StatisticsYearDto

  allEmployeeDetailsShown: boolean = false
  employeeDetailsShown: boolean[] = []

  allPositionDetailsShown: boolean = false
  positionDetailsShown: boolean[] = []

  constructor(
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
  }

  private onYearChange(newYear: number) {
    this.statisticsLoaded = false
    this.statisticsService.getYearStatistics(newYear).subscribe(newStatistics => {
      newStatistics.sort()
      this.employeeDetailsShown = Utils.emptyBooleanArray(newStatistics.employeeStatistics.length, this.allEmployeeDetailsShown)
      this.positionDetailsShown = Utils.emptyBooleanArray(newStatistics.positionStatistics.length, this.allPositionDetailsShown)
      this.statistics = newStatistics
      this.statisticsLoaded = true
    })
  }

  setAllEmployeeDetailsShown(val: boolean) {
    this.allEmployeeDetailsShown = val
    for (let i = 0; i < this.employeeDetailsShown.length; i++) {
      this.employeeDetailsShown[i] = val
    }
  }

  setAllPositionDetailsShown(val: boolean) {
    this.allPositionDetailsShown = val
    for (let i = 0; i < this.positionDetailsShown.length; i++) {
      this.positionDetailsShown[i] = val
    }
  }

}
