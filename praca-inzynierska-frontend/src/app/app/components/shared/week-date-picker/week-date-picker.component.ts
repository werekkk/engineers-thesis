import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'week-date-picker',
  templateUrl: './week-date-picker.component.html',
  styleUrls: ['./week-date-picker.component.scss']
})
export class WeekDatePickerComponent implements OnInit {

  _date: Date
  get date(): Date {
    return this._date
  }
  @Input()
  set date(val: Date) {
    this._date = val
    this.lastDate = moment(val).add(6, 'day').toDate()
  }

  lastDate: Date

  @Output()
  dateChange: EventEmitter<Date> = new EventEmitter()

  @Input()
  periodStart: Date = null
  @Input()
  periodFinish: Date = null

  canPickPreviousWeek: boolean = true
  canPickNextWeek: boolean = true

  constructor() { 
    this.date = new Date()
  }

  ngOnInit(): void {
    this.updateButtonsVisibility()
  }

  handleNextWeekClicked() {
    this.date = moment(this.date).add(1, 'week').toDate()
    this.updateButtonsVisibility()
    this.emitDateChange()
  }

  handlePreviousWeekClicked() {
    this.date = moment(this.date).subtract(1, 'week').toDate()
    this.updateButtonsVisibility()
    this.emitDateChange()
  }

  emitDateChange() {
    this.dateChange.emit(this.date)
  }

  private updateButtonsVisibility() {
    if (this.periodStart) {
      this.canPickPreviousWeek = moment(this.periodStart).diff(this.date, 'days') < 0
    }
    if (this.periodFinish) {
      this.canPickNextWeek = moment(this.periodFinish).diff(this.lastDate, 'days') > 0
    }
  }
}
