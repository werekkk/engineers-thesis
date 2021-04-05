package jwer.backend.model.dto

import jwer.backend.model.embeddable.TimePeriod
import jwer.backend.model.entity.HourPreference
import jwer.backend.model.entity.PreferenceType

data class HourPreferenceDto(
        val type: PreferenceType,
        val timePeriod: TimePeriod
) {
    constructor(hp: HourPreference) : this(
            hp.type, hp.period
    )
}