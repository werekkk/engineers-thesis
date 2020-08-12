package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.embeddable.DateTimePeriod
import jwer.pracainzynierskabackend.model.entity.OneTimeHourPreference
import jwer.pracainzynierskabackend.model.entity.PreferenceType
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