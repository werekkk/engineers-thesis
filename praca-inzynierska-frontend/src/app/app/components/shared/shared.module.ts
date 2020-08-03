import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutComponent } from './logout/logout.component'
import { InvitationLinkPipe } from '../../pipes/invitation-link.pipe'
import { DayOfWeekPipe } from '../../pipes/day-of-week.pipe'
import { TimePipe } from '../../pipes/time.pipe'

@NgModule({
  declarations: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LogoutComponent,
    InvitationLinkPipe,
    TimePipe,
    DayOfWeekPipe
  ]
})
export class SharedModule { }
