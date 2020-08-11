import { RequiredStaffDayBackendDto } from './RequiredStaffDayBackendDto';
import { RequiredStaffDto } from '../RequiredStaffDto';

/**
 * Corresponds with the `RequiredStaffDto` in the backend application.
 */
export class RequiredStaffBackendDto {

    constructor(
        public id,
        public mondayStaff: RequiredStaffDayBackendDto,
        public tuesdayStaff: RequiredStaffDayBackendDto,
        public wednesdayStaff: RequiredStaffDayBackendDto,
        public thursdayStaff: RequiredStaffDayBackendDto,
        public fridayStaff: RequiredStaffDayBackendDto,
        public saturdayStaff: RequiredStaffDayBackendDto,
        public sundayStaff: RequiredStaffDayBackendDto
    ) {}

    static of(rs: RequiredStaffDto): RequiredStaffBackendDto {
        return new RequiredStaffBackendDto(
            rs.id,
            RequiredStaffDayBackendDto.of(rs.mondayStaff),
            RequiredStaffDayBackendDto.of(rs.tuesdayStaff),
            RequiredStaffDayBackendDto.of(rs.wednesdayStaff),
            RequiredStaffDayBackendDto.of(rs.thursdayStaff),
            RequiredStaffDayBackendDto.of(rs.fridayStaff),
            RequiredStaffDayBackendDto.of(rs.saturdayStaff),
            RequiredStaffDayBackendDto.of(rs.sundayStaff)
        )
    }

}