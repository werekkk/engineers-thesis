package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.PreferencesWeek

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
}