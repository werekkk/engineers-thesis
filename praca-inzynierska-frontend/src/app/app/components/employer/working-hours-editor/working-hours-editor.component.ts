import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkingHoursDto } from 'src/app/app/model/dto/WorkingHoursDto';

@Component({
  selector: 'working-hours-editor',
  templateUrl: './working-hours-editor.component.html',
  styleUrls: ['./working-hours-editor.component.scss']
})
export class WorkingHoursEditorComponent implements OnInit {

  @Input('workingHours')
  workingHours: WorkingHoursDto

  @Output('workingHoursChange')
  workingHoursChange: EventEmitter<WorkingHoursDto> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
