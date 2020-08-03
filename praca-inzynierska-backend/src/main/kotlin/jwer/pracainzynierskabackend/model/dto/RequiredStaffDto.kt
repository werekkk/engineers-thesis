package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.RequiredStaff

data class RequiredStaffDto(

        val id: Long,

        val mondayStaff: RequiredStaffDayDto,
        val tuesdayStaff: RequiredStaffDayDto,
        val wednesdayStaff: RequiredStaffDayDto,
        val thursdayStaff: RequiredStaffDayDto,
        val fridayStaff: RequiredStaffDayDto,
        val saturdayStaff: RequiredStaffDayDto,
        val sundayStaff: RequiredStaffDayDto

) {
    constructor(requiredStaff: RequiredStaff)
    : this(
            requiredStaff.id,
            RequiredStaffDayDto(requiredStaff.mondayStaff),
            RequiredStaffDayDto(requiredStaff.tuesdayStaff),
            RequiredStaffDayDto(requiredStaff.wednesdayStaff),
            RequiredStaffDayDto(requiredStaff.thursdayStaff),
            RequiredStaffDayDto(requiredStaff.fridayStaff),
            RequiredStaffDayDto(requiredStaff.saturdayStaff),
            RequiredStaffDayDto(requiredStaff.sundayStaff)
    )
}
