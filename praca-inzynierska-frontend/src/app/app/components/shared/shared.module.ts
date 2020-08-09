import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutComponent } from './logout/logout.component'
import { InvitationLinkPipe } from '../../pipes/invitation-link.pipe'
import { DayOfWeekPipe } from '../../pipes/day-of-week.pipe'
import { TimePipe } from '../../pipes/time.pipe';
import { TimePickerComponent } from './time-picker/time-picker.component'
import { FormsModule } from '@angular/forms';
import { TimePickerSuggestionsComponent } from './time-picker-suggestions/time-picker-suggestions.component';
import { TimePeriodPickerComponent } from './time-period-picker/time-period-picker.component';

@NgModule({
  declarations: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe,
    TimePickerComponent,
    TimePickerSuggestionsComponent,
    TimePeriodPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe,
    TimePickerComponent,
    TimePeriodPickerComponent
  ]
})
export class SharedModule { }
