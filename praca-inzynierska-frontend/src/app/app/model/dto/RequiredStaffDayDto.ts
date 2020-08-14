import { RequiredStaffTimePeriodDto } from './RequiredStaffTimePeriodDto'
import { RequiredStaffDayBackendDto } from './backend/RequiredStaffDayBackendDto';
import { ShiftDto } from './ShiftDto';
import { IntegratedIntervals } from '../../shared/utils/integrated-intervals'

export type AllocatedHours = {hours: number, isDayFilled: boolean} 

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

    countAllocatedShiftHours(shifts: ShiftDto[]): AllocatedHours {
        let secondIntervals = new IntegratedIntervals()
        let dayFilled = true
        shifts.forEach(s => {
            secondIntervals.add(s.period.start.toSeconds(), s.period.finish.toSeconds(), 1)
        })
        let totalAllocatedSeconds = 0
        this.timePeriods.forEach(rs => {
            let allocatedSeconds = secondIntervals.limitedIntegral(rs.timePeriod.start.toSeconds(), rs.timePeriod.finish.toSeconds(), rs.employeeCount)
            dayFilled = dayFilled && allocatedSeconds >= (rs.seconds() / rs.employeeCount)
            totalAllocatedSeconds += allocatedSeconds
        })
        return {hours: totalAllocatedSeconds / 3600, isDayFilled: dayFilled}
    }

}