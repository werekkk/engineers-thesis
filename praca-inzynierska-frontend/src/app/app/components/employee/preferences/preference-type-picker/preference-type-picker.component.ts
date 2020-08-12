import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreferenceType } from 'src/app/app/model/PreferenceType';

@Component({
  selector: 'preference-type-picker',
  templateUrl: './preference-type-picker.component.html',
  styleUrls: ['./preference-type-picker.component.scss']
})
export class PreferenceTypePickerComponent implements OnInit {

  @Input('preferenceType')
  preferenceType: PreferenceType
  
  @Output('preferenceTypeChange')
  preferenceTypeChange: EventEmitter<PreferenceType> = new EventEmitter()

  willing = PreferenceType.WILLING
  available = PreferenceType.AVAILABLE
  unwilling = PreferenceType.UNWILLING
  unavailable = PreferenceType.UNAVAILABLE

  constructor() { }

  ngOnInit(): void {
  }

}
