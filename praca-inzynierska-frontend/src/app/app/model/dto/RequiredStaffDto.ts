import { RequiredStaffDayDto } from "./RequiredStaffDayDto";
import { RequiredStaffBackendDto } from "./backend/RequiredStaffBackendDto";

export class RequiredStaffDto {

    constructor(
        public id: number = 0,
        public mondayStaff: RequiredStaffDayDto,
        public tuesdayStaff: RequiredStaffDayDto,
        public wednesdayStaff: RequiredStaffDayDto,
        public thursdayStaff: RequiredStaffDayDto,
        public fridayStaff: RequiredStaffDayDto,
        public saturdayStaff: RequiredStaffDayDto,
        public sundayStaff: RequiredStaffDayDto
    ) {}

    static of(requiredStaff: RequiredStaffBackendDto) {
        return new RequiredStaffDto(
            requiredStaff.id,
            RequiredStaffDayDto.of(requiredStaff.mondayStaff),
            RequiredStaffDayDto.of(requiredStaff.tuesdayStaff),
            RequiredStaffDayDto.of(requiredStaff.wednesdayStaff),
            RequiredStaffDayDto.of(requiredStaff.thursdayStaff),
            RequiredStaffDayDto.of(requiredStaff.fridayStaff),
            RequiredStaffDayDto.of(requiredStaff.saturdayStaff),
            RequiredStaffDayDto.of(requiredStaff.sundayStaff)
        )
    }

    getDayStaff(date: Date): RequiredStaffDayDto {
        switch (date.getDay()) {
            case 1:
                return this.mondayStaff;
            case 2:
                return this.tuesdayStaff;
            case 3:
                return this.wednesdayStaff;
            case 4:
                return this.thursdayStaff;
            case 5:
                return this.fridayStaff;
            case 6:
                return this.saturdayStaff;
            case 0:
                return this.sundayStaff;
            default:
                return undefined;
        }
    }
}