package jwer.backend.model.dto

import jwer.backend.model.entity.RequiredStaffDay

data class RequiredStaffDayDto(

        val id: Long,

        val timePeriods: List<RequiredStaffTimePeriodDto>

) {
    constructor(requiredStaff: RequiredStaffDay)
    : this(requiredStaff.id, requiredStaff.timePeriods.map { t -> RequiredStaffTimePeriodDto(t) })
}