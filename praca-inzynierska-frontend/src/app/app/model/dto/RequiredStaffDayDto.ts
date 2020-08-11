import { RequiredStaffTimePeriodDto } from './RequiredStaffTimePeriodDto'
import { RequiredStaffDayBackendDto } from './backend/RequiredStaffDayBackendDto';

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

}