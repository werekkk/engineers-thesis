package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.utils.TimePointArray
import jwer.pracainzynierskabackend.model.entity.RequiredStaff
import jwer.pracainzynierskabackend.utils.iterator
import java.time.DayOfWeek
import java.time.LocalDate

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

    /**
     * @param start (inclusive)
     * @param finish (inclusive)
     */
    fun toRequiredStaffArray(start: LocalDate, finish: LocalDate): Array<Int> {
        val array = TimePointArray<Int>(start, finish, { it })
        for (date in start..finish) {
            getStaffByDate(date).timePeriods.forEach {
                array[it.timePeriod.atDate(date)] = it.employeeCount
            }
        }
        return array.array
    }

    private fun getStaffByDate(date: LocalDate): RequiredStaffDayDto {
        return when (date.dayOfWeek) {
            DayOfWeek.MONDAY -> mondayStaff
            DayOfWeek.TUESDAY -> tuesdayStaff
            DayOfWeek.WEDNESDAY -> wednesdayStaff
            DayOfWeek.THURSDAY -> thursdayStaff
            DayOfWeek.FRIDAY -> fridayStaff
            DayOfWeek.SATURDAY -> saturdayStaff
            DayOfWeek.SUNDAY -> sundayStaff
        }
    }
}