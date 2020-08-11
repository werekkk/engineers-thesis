import { TimePeriod } from '../../TimePeriod';
import { WorkingHoursDto } from '../WorkingHoursDto';

/**
 * Corresponds with the `WorkingHoursDto` class in the backend application.
 */
export class WorkingHoursBackendDto {
    constructor(
        public monday: TimePeriod,
        public tuesday: TimePeriod,
        public wednesday: TimePeriod,
        public thursday: TimePeriod,
        public friday: TimePeriod,
        public saturday: TimePeriod,
        public sunday: TimePeriod
    ) {}

    static of(workingHours: WorkingHoursDto): WorkingHoursBackendDto {
        return new WorkingHoursBackendDto(
            workingHours.monday ? TimePeriod.of(workingHours.monday) : null,
            workingHours.tuesday ? TimePeriod.of(workingHours.tuesday) : null,
            workingHours.wednesday ? TimePeriod.of(workingHours.wednesday) : null,
            workingHours.thursday ? TimePeriod.of(workingHours.thursday) : null,
            workingHours.friday ? TimePeriod.of(workingHours.friday) : null,
            workingHours.saturday ? TimePeriod.of(workingHours.saturday) : null,
            workingHours.sunday ? TimePeriod.of(workingHours.sunday) : null
        )
    }
}