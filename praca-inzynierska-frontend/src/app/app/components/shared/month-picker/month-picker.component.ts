import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent {


  _month: Moment = moment().locale('pl')
  get month(): Moment {
    return this._month
  }
  @Input()
  set month(val: Moment) {
    this._month = val
  }
  
  @Output()
  monthChange: EventEmitter<Moment> = new EventEmitter()

  constructor() { }

  onPreviousMonthClicked() {
    this.month = this.month.subtract(1, 'month')
    this.emitNewMonth()
  }

  onNextMonthClicked() {
    this.month = this.month.add(1, 'month')
    this.emitNewMonth()
  }

  emitNewMonth() {
    this.monthChange.emit(this.month)
  }

}
