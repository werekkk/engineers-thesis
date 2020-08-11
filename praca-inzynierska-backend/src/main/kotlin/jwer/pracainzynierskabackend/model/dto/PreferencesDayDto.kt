package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.PreferencesDay

data class PreferencesDayDto(
        val preferences: List<HourPreferenceDto> = listOf()
) {
    constructor(pd: PreferencesDay) : this(
            pd.hourPreferences.map { hp -> HourPreferenceDto(hp) }
    )
}