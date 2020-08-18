package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
import jwer.pracainzynierskabackend.model.entity.RequiredStaffTimePeriod

data class RequiredStaffTimePeriodDto(

        val id: Long = 0,
        val employeeCount: Int,
        val timePeriod: TimePeriod

) {
    constructor(requiredStaff: RequiredStaffTimePeriod)
    : this(requiredStaff.id, requiredStaff.employeeCount, requiredStaff.timePeriod)
}