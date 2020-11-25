import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';

@Component({
  selector: 'preference-type-picker',
  templateUrl: './preference-type-picker.component.html',
  styleUrls: ['./preference-type-picker.component.scss']
})
export class PreferenceTypePickerComponent implements OnInit {

  @Input()
  preferenceType: PreferenceType
  
  @Output()
  preferenceTypeChange: EventEmitter<PreferenceType> = new EventEmitter()

  willing = PreferenceType.WILLING
  available = PreferenceType.AVAILABLE
  unwilling = PreferenceType.UNWILLING
  unavailable = PreferenceType.UNAVAILABLE

  constructor() { }

  ngOnInit(): void {
  }

  getTypeColor(type: PreferenceType): string {
    return PreferenceType.toColor(type)
  }
}
