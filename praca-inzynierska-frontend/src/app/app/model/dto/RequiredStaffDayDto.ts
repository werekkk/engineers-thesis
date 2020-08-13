import { RequiredStaffTimePeriodDto } from './RequiredStaffTimePeriodDto'
import { RequiredStaffDayBackendDto } from './backend/RequiredStaffDayBackendDto';
import { ShiftDto } from './ShiftDto';

export class RequiredStaffDayDto {

    constructor(
        public id: number = 0,
        public timePeriods: RequiredStaffTimePeriodDto[]
    ) {}

    static of(requiredStaffDay: RequiredStaffDayBackendDto) {
        return new RequiredStaffDayDto(
            requiredStaffDay.id,
            requiredStaffDay.timePeriods.map(tp => RequiredStaffTimePeriodDto.of(tp))
        )
    }

    totalRequiredHours(): number {
        return this.timePeriods.map(p => p.hours()).reduce((prev, cur) => prev + cur)
    }

    countAllocatedShiftHours(shifts: ShiftDto[]): number {
        this.timePeriods.sort((a, b) => a.timePeriod.start.toSeconds() - b.timePeriod.start.toSeconds())
        return 0
        // todo
    }

}