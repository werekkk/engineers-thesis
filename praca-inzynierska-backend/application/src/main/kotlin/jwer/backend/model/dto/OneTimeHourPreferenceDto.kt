package jwer.backend.model.dto

import jwer.backend.model.entity.OneTimeHourPreference
import jwer.backend.model.entity.PreferenceType
import java.time.LocalDateTime

data class OneTimeHourPreferenceDto(
        var id: Long = 0,
        val type: PreferenceType,
        val start: LocalDateTime,
        val finish: LocalDateTime
) {
    constructor(othp: OneTimeHourPreference) : this (
            othp.id, othp.type, othp.period.start, othp.period.finish
    )
}