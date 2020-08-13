import { TimePeriodDto } from './dto/TimePeriodDto'
import { Type } from '@angular/core';
import { TimeDto } from './dto/TimeDto';

export interface HasTimePeriod {
    timePeriod: TimePeriodDto
    periodType: any 
    doNotKeep: () => boolean
    withNewPeriod(newPeriod: TimePeriodDto): HasTimePeriod
    setStartTime: (newStart: TimeDto) => void
    setFinishTime: (newFinish: TimeDto) => void
}