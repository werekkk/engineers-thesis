import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent  {

  private minYear = 1000
  private maxYear = 3000

  _year: number = new Date().getFullYear()
  get year(): number {
    return this._year
  }
  @Input()
  set year(val: number) {
    this._year = val
  }
  
  @Output()
  yearChange: EventEmitter<number> = new EventEmitter()

  constructor() { }

  onPreviousYearClicked() {
    this.year = Math.max(this.year - 1, this.minYear)
    this.emitNewYear()
  }

  onNextYearClicked() {
    this.year = Math.min(this.year + 1, this.maxYear)
    this.emitNewYear()
  }

  emitNewYear() {
    this.yearChange.emit(this.year)
  }

}
