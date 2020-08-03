import { TimePeriodDto } from "./TimePeriodDto";
import { RequiredStaffTimePeriodBackendDto } from "./RequiredStaffTimePeriodBackendDto";

export class RequiredStaffTimePeriodDto {
    
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
}