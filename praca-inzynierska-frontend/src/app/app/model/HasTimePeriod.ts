import { TimePeriodDto } from './dto/TimePeriodDto'
import { Type } from '@angular/core';

export interface HasTimePeriod {
    timePeriod: TimePeriodDto
    periodType: any 
    doNotKeep: () => boolean
    withNewPeriod(newPeriod: TimePeriodDto): HasTimePeriod
}