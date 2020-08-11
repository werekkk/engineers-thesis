import { PreferencesDayBackendDto } from './PreferencesDayBackendDto';
import { PreferencesWeekDto } from '../PreferencesWeekDto';

/**
 * Corresponds with the `PreferencesWeekDto` class in the backend application.
 */
export class PreferencesWeekBackendDto {

    constructor(
        public mondayPreferences: PreferencesDayBackendDto,
        public tuesdayPreferences: PreferencesDayBackendDto,
        public wednesdayPreferences: PreferencesDayBackendDto,
        public thursdayPreferences: PreferencesDayBackendDto,
        public fridayPreferences: PreferencesDayBackendDto,
        public saturdayPreferences: PreferencesDayBackendDto,
        public sundayPreferences: PreferencesDayBackendDto
    ) {}

    static of(pw: PreferencesWeekDto): PreferencesWeekBackendDto {
        return new PreferencesWeekBackendDto(
            PreferencesDayBackendDto.of(pw.mondayPreferences),
            PreferencesDayBackendDto.of(pw.tuesdayPreferences),
            PreferencesDayBackendDto.of(pw.wednesdayPreferences),
            PreferencesDayBackendDto.of(pw.thursdayPreferences),
            PreferencesDayBackendDto.of(pw.fridayPreferences),
            PreferencesDayBackendDto.of(pw.saturdayPreferences),
            PreferencesDayBackendDto.of(pw.sundayPreferences)
        )
    }

}