import { RequiredStaffTimePeriodBackendDto } from './RequiredStaffTimePeriodBackendDto';
import { RequiredStaffDayDto } from '../RequiredStaffDayDto';

/**
 * Corresponds with the `RequiredStaffDayDto` in the backend application.
 */
export class RequiredStaffDayBackendDto {

    constructor(
        public id: number = 0,
        public timePeriods: RequiredStaffTimePeriodBackendDto[]
    ) {}

    static of(rs: RequiredStaffDayDto): RequiredStaffDayBackendDto {
        return new RequiredStaffDayBackendDto(rs.id, rs.timePeriods.map(tp => RequiredStaffTimePeriodBackendDto.of(tp)))
    }

}