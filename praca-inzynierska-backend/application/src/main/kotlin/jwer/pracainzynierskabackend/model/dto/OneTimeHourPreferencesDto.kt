package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.utils.TimePointArray
import jwer.pracainzynierskabackend.model.entity.OneTimeHourPreference
import jwer.pracainzynierskabackend.model.entity.PreferenceType
import java.time.LocalDate

data class OneTimeHourPreferencesDto(
        val preferences: List<OneTimeHourPreferenceDto>
) {
    // constructor(ps: List<OneTimeHourPreference>) results in a 'Platform declaration clash' compiler error - possible kotlin bug
    // adding an unused parameter `a` fixes the error
    constructor(ps: List<OneTimeHourPreference>, @Suppress("UNUSED_PARAMETER") a:Any? = null) : this(
            ps.map { p -> OneTimeHourPreferenceDto(p) }
    )

    fun areInDay(day: LocalDate): Boolean {
        return preferences.fold(true, { acc, p -> return acc && p.start.toLocalDate() == day && p.finish.toLocalDate() == day})
    }

    /**
     * @param start (inclusive)
     * @param finish (inclusive)
     */
    fun toPreferencesArray(preferencesWeekArray: Array<Int>, start: LocalDate, finish: LocalDate): Array<Int> {
        val array = TimePointArray<PreferenceType>(start, finish, { it.toNumber() }, preferencesWeekArray)
        preferences.forEach {
            array[it.start, it.finish] = it.type
        }
        return array.array
    }
}