import { HourPreferenceDto } from './HourPreferenceDto';
import { PreferencesDayBackendDto } from './backend/PreferencesDayBackendDto';
import { PreferenceType } from '../PreferenceType';
import { TimePeriodDto } from './TimePeriodDto';
import { TimeDto } from './TimeDto';

export class PreferencesDayDto {

    constructor(
        public preferences: HourPreferenceDto[]
    ) {}

    static of(pd: PreferencesDayBackendDto): PreferencesDayDto {
        return new PreferencesDayDto(
            pd.preferences.map(hp => HourPreferenceDto.of(hp))
        )
    }

    sortPreferences() {
        this.preferences = this.preferences.sort((a, b) => a.timePeriod.compare(b.timePeriod))
    }

    fillEmptyPeriodsWithDefaultPreference() {
        let nextPeriod = new TimePeriodDto(new TimeDto(0, 0), new TimeDto(24, 0))
        for (let index = 0; index < this.preferences.length; index++) {
            const pref = this.preferences[index];
            if (pref.timePeriod.start.equals(nextPeriod.start)) {
                nextPeriod.start = pref.timePeriod.finish.copy()
            } else {
                nextPeriod.finish = pref.timePeriod.start.copy()
                this.preferences.splice(index, 0, new HourPreferenceDto(PreferenceType.DEFAULT, nextPeriod))
                nextPeriod = new TimePeriodDto(pref.timePeriod.finish.copy(), new TimeDto(24, 0))
                index++
            }
        }
        if (this.preferences.length == 0 || !this.preferences[this.preferences.length - 1].timePeriod.finish.equals(nextPeriod.finish)) {
            this.preferences.push(new HourPreferenceDto(PreferenceType.DEFAULT, nextPeriod))
        }
    }

    filterOutDefaultPreferences() {
        this.preferences = this.preferences.filter(hp => hp.type != PreferenceType.DEFAULT)
    }

    copy(): PreferencesDayDto {
        return new PreferencesDayDto(
            this.preferences.map(p => p.copy())
        )
    }

}