import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences/preferences.component'
import { PreferencesWeekComponent } from './preferences-week/preferences-week.component';
import { PreferencesWeekEditorComponent } from './preferences-week-editor/preferences-week-editor.component';
import { PreferenceTypePickerComponent } from './preference-type-picker/preference-type-picker.component'
import { PreferencesWeekTableComponent } from './preferences-week-table/preferences-week-table.component'
import { PreferencesWeekTableColumnComponent } from './preferences-week-table-column/preferences-week-table-column.component'
import { PreferencesRoutingModule } from './preferences-routing.module'
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreferencesOneTimeComponent } from './preferences-one-time/preferences-one-time.component';
import { PreferencesOneTimeCalendarComponent } from './preferences-one-time-calendar/preferences-one-time-calendar.component';
import { PreferencesOneTimeDayModalComponent } from './preferences-one-time-day-modal/preferences-one-time-day-modal.component';
import { PreferencesOneTimeDayEditorComponent } from './preferences-one-time-day-editor/preferences-one-time-day-editor.component';


@NgModule({
  declarations: [
    PreferencesComponent, 
    PreferencesWeekComponent, 
    PreferencesWeekEditorComponent, 
    PreferenceTypePickerComponent, 
    PreferencesWeekTableComponent, 
    PreferencesWeekTableColumnComponent, PreferencesOneTimeComponent, PreferencesOneTimeCalendarComponent, PreferencesOneTimeDayModalComponent, PreferencesOneTimeDayEditorComponent
  ],
  imports: [
    CommonModule,
    PreferencesRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule
  ]
})
export class PreferencesModule { }
