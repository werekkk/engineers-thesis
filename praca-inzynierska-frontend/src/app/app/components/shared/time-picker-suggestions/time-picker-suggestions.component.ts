import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HourInputUtils } from '../../../shared/hour-input-utils'

@Component({
  selector: 'time-picker-suggestions',
  templateUrl: './time-picker-suggestions.component.html',
  styleUrls: ['./time-picker-suggestions.component.scss']
})
export class TimePickerSuggestionsComponent implements OnInit {

  @Output('mouseOver')
  mouseOver: EventEmitter<boolean> = new EventEmitter()

  @Input('allHours')
  allHours: string[]

  @Input('userInput')
  set userInput(val: string) {
    this.handleUserInput(val)
  }

  highlightedHour: string = null

  @Output('hourSelected')
  onHourSelected: EventEmitter<string> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  selectHour(index: number) {
    this.onHourSelected.emit(this.allHours[index])
  }

  highlightHourByIndex(index: number) {
    this.highlightHour(this.allHours[index])
  }

  private handleUserInput(userInput: string) {
    let closestHour = HourInputUtils.stringToClosestHour(userInput, this.allHours)
    this.highlightHour(closestHour)
  }

  highlightHour(hour: string) {
    let elem = document.getElementById(hour) as HTMLElement
    if (elem) {
      this.highlightedHour = hour
      elem.scrollIntoView({behavior:'auto', block:'center'})
    } else {
      this.highlightedHour = null
    }
  }

  onMouseEnter() {
    this.mouseOver.emit(true)
  }

  onMouseLeave() {
    this.mouseOver.emit(false)
  }

  
}
