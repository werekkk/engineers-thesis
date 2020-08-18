package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.OneTimeHourPreference
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
}