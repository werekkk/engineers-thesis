package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
import jwer.pracainzynierskabackend.model.entity.HourPreference
import jwer.pracainzynierskabackend.model.entity.PreferenceType

data class HourPreferenceDto(
        val type: PreferenceType,
        val timePeriod: TimePeriod
) {
    constructor(hp: HourPreference) : this(
            hp.type, hp.period
    )
}