package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.RequiredStaffDay

data class RequiredStaffDayDto(

        val id: Long,

        val timePeriods: List<RequiredStaffTimePeriodDto>

) {
    constructor(requiredStaff: RequiredStaffDay)
    : this(requiredStaff.id, requiredStaff.timePeriods.map { t -> RequiredStaffTimePeriodDto(t) })
}