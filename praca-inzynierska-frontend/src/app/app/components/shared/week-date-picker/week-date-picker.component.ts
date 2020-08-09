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
  @Input('date')
  set date(val: Date) {
    this._date = val
    this.lastDate = moment(val).add(6, 'day').toDate()
  }

  lastDate: Date

  @Output('dateChange')
  dateChange: EventEmitter<Date> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  handleNextWeekClicked() {
    this.date = moment(this.date).add(1, 'week').toDate()
    this.emitDateChange()
  }

  handlePreviousWeekClicked() {
    this.date = moment(this.date).subtract(1, 'week').toDate()
    this.emitDateChange()
  }

  emitDateChange() {
    this.dateChange.emit(this.date)
  }
}
