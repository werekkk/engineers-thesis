import { OneTimeHourPreferenceDto } from './OneTimeHourPreferenceDto';

export class OneTimeHourPreferencesDto {

    constructor(
        public preferences: OneTimeHourPreferenceDto[]
    ) {}

    datesToBackend() {
        this.preferences.forEach(p => p.datesToBackend())
    }

    static toObject(other: OneTimeHourPreferencesDto): OneTimeHourPreferencesDto {
        return new OneTimeHourPreferencesDto(
            other.preferences.map(p => OneTimeHourPreferenceDto.toObject(p))
        )
    }
}