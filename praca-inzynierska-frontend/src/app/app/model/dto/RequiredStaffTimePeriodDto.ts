import { TimePeriodDto } from './TimePeriodDto';
import { RequiredStaffTimePeriodBackendDto } from './backend/RequiredStaffTimePeriodBackendDto';
import { HasTimePeriod } from '../HasTimePeriod'
import { TimeDto } from './TimeDto';

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

    static comparePeriods(a: RequiredStaffTimePeriodDto, b: RequiredStaffTimePeriodDto): number {
        return a.timePeriod.compare(b.timePeriod);
    }
    
    seconds() {
        return this.timePeriod.seconds() * this.employeeCount
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

    setStartTime(newStart: TimeDto) {
        this.timePeriod.start = newStart
    }

    setFinishTime(newFinish: TimeDto) {
        this.timePeriod.finish = newFinish
    }

    equalsWithoutId(other: RequiredStaffTimePeriodDto): boolean {
        return this.employeeCount == other.employeeCount && this.timePeriod.compare(other.timePeriod) == 0
    }
}