import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeStep } from 'src/app/app/model/TimeStep';

@Component({
  selector: 'time-step-picker',
  templateUrl: './time-step-picker.component.html',
  styleUrls: ['./time-step-picker.component.scss']
})
export class TimeStepPickerComponent {

  @Input('timeStep')
  timeStep: TimeStep = TimeStep.DEFAULT

  @Output('timeStepChange')
  timeStepChange: EventEmitter<TimeStep> = new EventEmitter()

}
