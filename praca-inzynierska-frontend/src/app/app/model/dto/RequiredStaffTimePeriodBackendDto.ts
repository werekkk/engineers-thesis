import { TimePeriod } from '../TimePeriod'
import { RequiredStaffTimePeriodDto } from './RequiredStaffTimePeriodDto';

/**
 * Corresponds with the `RequiredStaffTimePeriodDto` in the backend application.
 */
export class RequiredStaffTimePeriodBackendDto {
    constructor(
        public id: number = 0,
        public employeeCount: number,
        public timePeriod: TimePeriod
    ) {}

    static of(rs: RequiredStaffTimePeriodDto): RequiredStaffTimePeriodBackendDto {
        return new RequiredStaffTimePeriodBackendDto(rs.id, rs.employeeCount, TimePeriod.of(rs.timePeriod))
    } 
}