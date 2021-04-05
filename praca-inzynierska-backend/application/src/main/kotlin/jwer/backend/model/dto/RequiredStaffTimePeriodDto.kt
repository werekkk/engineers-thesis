package jwer.backend.model.dto

import jwer.backend.model.embeddable.TimePeriod
import jwer.backend.model.entity.RequiredStaffTimePeriod

data class RequiredStaffTimePeriodDto(

        val id: Long = 0,
        val employeeCount: Int,
        val timePeriod: TimePeriod

) {
    constructor(requiredStaff: RequiredStaffTimePeriod)
    : this(requiredStaff.id, requiredStaff.employeeCount, requiredStaff.period)
}