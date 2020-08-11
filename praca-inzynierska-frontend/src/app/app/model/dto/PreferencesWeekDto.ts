import { PreferencesDayDto } from './PreferencesDayDto';
import { PreferencesWeekBackendDto } from './backend/PreferencesWeekBackendDto';

export class PreferencesWeekDto {

    constructor(
        public mondayPreferences: PreferencesDayDto,
        public tuesdayPreferences: PreferencesDayDto,
        public wednesdayPreferences: PreferencesDayDto,
        public thursdayPreferences: PreferencesDayDto,
        public fridayPreferences: PreferencesDayDto,
        public saturdayPreferences: PreferencesDayDto,
        public sundayPreferences: PreferencesDayDto
    ) {}

    static of(pw: PreferencesWeekBackendDto): PreferencesWeekDto {
        return new PreferencesWeekDto(
            PreferencesDayDto.of(pw.mondayPreferences),
            PreferencesDayDto.of(pw.tuesdayPreferences),
            PreferencesDayDto.of(pw.wednesdayPreferences),
            PreferencesDayDto.of(pw.thursdayPreferences),
            PreferencesDayDto.of(pw.fridayPreferences),
            PreferencesDayDto.of(pw.saturdayPreferences),
            PreferencesDayDto.of(pw.sundayPreferences)
        )
    }

    sortPreferences() {
        for (let i = 0; i < 7; i++) {
            this.getDay(i).sortPreferences()
        }
    }

    fillEmptyPeriodsWithDefaultPreference() {
        for (let i = 0; i < 7; i++) {
            this.getDay(i).fillEmptyPeriodsWithDefaultPreference()
        }
    }

    filterOutDefaultPreferences() {
        for (let i = 0; i < 7; i++) {
            this.getDay(i).filterOutDefaultPreferences()
        }
    }

    getDay(dayNumber: number): PreferencesDayDto {
        switch (dayNumber) {
            case 0:
                return this.mondayPreferences
            case 1:
                return this.tuesdayPreferences
            case 2:
                return this.wednesdayPreferences
            case 3:
                return this.thursdayPreferences
            case 4:
                return this.fridayPreferences
            case 5:
                return this.saturdayPreferences
            case 6:
                return this.sundayPreferences
            default:
                return undefined
        }
    }

    copy(): PreferencesWeekDto {
        return new PreferencesWeekDto(
            this.mondayPreferences.copy(),
            this.tuesdayPreferences.copy(),
            this.wednesdayPreferences.copy(),
            this.thursdayPreferences.copy(),
            this.fridayPreferences.copy(),
            this.saturdayPreferences.copy(),
            this.sundayPreferences.copy()
        )
    }

}