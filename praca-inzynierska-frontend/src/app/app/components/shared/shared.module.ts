import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutComponent } from './logout/logout.component'
import { InvitationLinkPipe } from '../../pipes/invitation-link.pipe'
import { DayOfWeekPipe } from '../../pipes/day-of-week.pipe'
import { TimePipe } from '../../pipes/time.pipe';
import { TimePickerComponent } from './time-picker/time-picker.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePickerSuggestionsComponent } from './time-picker-suggestions/time-picker-suggestions.component';
import { TimePeriodPickerComponent } from './time-period-picker/time-period-picker.component';
import { WeekDatePickerComponent } from './week-date-picker/week-date-picker.component';
import { TimeStepPickerComponent } from './time-step-picker/time-step-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { StringsPipe } from '../../pipes/strings.pipe';
import { DateToTimePipe } from '../../pipes/date-to-time.pipe';
import { TimePeriodCellComponent } from './time-period-cell/time-period-cell.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive'
import { PeriodLengthPipe } from '../../pipes/period-length.pipe';
import { OnEscapePressedDirective } from '../../directives/on-escape-pressed.directive';
import { OnEnterPressedDirective } from '../../directives/on-enter-pressed.directive';
import { YearPickerComponent } from './year-picker/year-picker.component';
import { AccountLabelComponent } from './account-label/account-label.component';
import { HoverGroupDirective } from '../../directives/hover-group.directive';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

@NgModule({
  declarations: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe,
    TimePickerComponent,
    TimePickerSuggestionsComponent,
    TimePeriodPickerComponent,
    WeekDatePickerComponent,
    TimeStepPickerComponent,
    MonthPickerComponent,
    StringsPipe,
    DateToTimePipe,
    TimePeriodCellComponent,
    ClickOutsideDirective,
    PeriodLengthPipe,
    OnEscapePressedDirective,
    OnEnterPressedDirective,
    YearPickerComponent,
    AccountLabelComponent,
    HoverGroupDirective,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe,
    TimePickerComponent,
    TimePeriodPickerComponent,
    WeekDatePickerComponent,
    TimeStepPickerComponent,
    MonthPickerComponent,
    StringsPipe,
    DateToTimePipe,
    TimePeriodCellComponent,
    ClickOutsideDirective,
    PeriodLengthPipe,
    OnEscapePressedDirective,
    OnEnterPressedDirective,
    YearPickerComponent,
    AccountLabelComponent,
    HoverGroupDirective,
    AccountSettingsComponent
  ]
})
export class SharedModule { }
