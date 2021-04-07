package jwer.backend.model.dto

import jwer.backend.utils.TimePointArray
import jwer.backend.model.entity.PreferenceType
import jwer.backend.model.entity.PreferencesWeek
import jwer.backend.utils.iterator
import java.time.DayOfWeek
import java.time.LocalDate

data class PreferencesWeekDto(
        val mondayPreferences: PreferencesDayDto,
        val tuesdayPreferences: PreferencesDayDto,
        val wednesdayPreferences: PreferencesDayDto,
        val thursdayPreferences: PreferencesDayDto,
        val fridayPreferences: PreferencesDayDto,
        val saturdayPreferences: PreferencesDayDto,
        val sundayPreferences: PreferencesDayDto
) {
    constructor(pw: PreferencesWeek) : this(
            PreferencesDayDto(pw.mondayPreferences),
            PreferencesDayDto(pw.tuesdayPreferences),
            PreferencesDayDto(pw.wednesdayPreferences),
            PreferencesDayDto(pw.thursdayPreferences),
            PreferencesDayDto(pw.fridayPreferences),
            PreferencesDayDto(pw.saturdayPreferences),
            PreferencesDayDto(pw.sundayPreferences)
    )

    fun toPreferenceArray(firstDay: LocalDate, lastDay: LocalDate): Array<Int> {
        val array = TimePointArray<PreferenceType>(firstDay, lastDay, { it.toNumber() }, initialValue = PreferenceType.AVAILABLE.toNumber())
        for (date in firstDay..lastDay) {
            getPreferenceByDate(date).preferences.forEach {
                array[it.timePeriod.atDate(date)] = it.type
            }
        }
        return array.array
    }

    private fun getPreferenceByDate(date: LocalDate): PreferencesDayDto {
        return when (date.dayOfWeek) {
            DayOfWeek.MONDAY -> mondayPreferences
            DayOfWeek.TUESDAY -> tuesdayPreferences
            DayOfWeek.WEDNESDAY -> wednesdayPreferences
            DayOfWeek.THURSDAY -> thursdayPreferences
            DayOfWeek.FRIDAY -> fridayPreferences
            DayOfWeek.SATURDAY -> saturdayPreferences
            DayOfWeek.SUNDAY -> sundayPreferences
            null -> PreferencesDayDto()
        }
    }
}