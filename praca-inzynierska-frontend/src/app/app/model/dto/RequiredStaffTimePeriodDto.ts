import { TimePeriodDto } from './TimePeriodDto';
import { RequiredStaffTimePeriodBackendDto } from './backend/RequiredStaffTimePeriodBackendDto';
import { HasTimePeriod } from '../HasTimePeriod'

export class RequiredStaffTimePeriodDto implements HasTimePeriod {
    
    get periodType(): number {
        return this.employeeCount
    }

    constructor(
        public id: number = 0,
        public employeeCount: number,
        public timePeriod: TimePeriodDto
    ) {}

    static of(requiredStaff: RequiredStaffTimePeriodBackendDto) {
        return new RequiredStaffTimePeriodDto(
            requiredStaff.id, 
            requiredStaff.employeeCount, 
            TimePeriodDto.of(requiredStaff.timePeriod))
    }

    hours() {
        return this.timePeriod.hours() * this.employeeCount
    }

    doNotKeep() {
        return this.employeeCount == 0
    }

    withNewPeriod(newPeriod: TimePeriodDto): HasTimePeriod {
        return new RequiredStaffTimePeriodDto(0, this.employeeCount, newPeriod)
    }
}