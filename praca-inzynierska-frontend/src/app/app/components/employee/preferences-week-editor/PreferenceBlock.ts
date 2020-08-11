import { PreferencesWeekDto } from '../../../model/dto/PreferencesWeekDto'
import { PreferencesDayDto } from '../../../model/dto/PreferencesDayDto'
import { PreferenceType } from '../../../model/PreferenceType'

export class PreferenceBlock {

    constructor(
        public x1: number,
        public x2: number,
        public y1: number,
        public y2: number,
        public color: string
    ) {}

    static fromPreferencesWeek(week: PreferencesWeekDto, x: number, y: number, w: number, h: number): PreferenceBlock[] {
        let blocks = []
        blocks = blocks.concat(this.fromPreferencesDay(week.mondayPreferences, x, w, (y + (h/7)*0), (y + (h/7)*1)))
        blocks = blocks.concat(this.fromPreferencesDay(week.tuesdayPreferences, x, w, (y + (h/7)*1), (y + (h/7)*2)))
        blocks = blocks.concat(this.fromPreferencesDay(week.wednesdayPreferences, x, w, (y + (h/7)*2), (y + (h/7)*3)))
        blocks = blocks.concat(this.fromPreferencesDay(week.thursdayPreferences, x, w, (y + (h/7)*3), (y + (h/7)*4)))
        blocks = blocks.concat(this.fromPreferencesDay(week.fridayPreferences, x, w, (y + (h/7)*4), (y + (h/7)*5)))
        blocks = blocks.concat(this.fromPreferencesDay(week.saturdayPreferences, x, w, (y + (h/7)*5), (y + (h/7)*6)))
        blocks = blocks.concat(this.fromPreferencesDay(week.sundayPreferences, x, w, (y + (h/7)*6), (y + (h/7)*7)))
        return blocks
    }

    private static fromPreferencesDay(day: PreferencesDayDto, x: number, w: number, y1: number, y2: number): PreferenceBlock[] {
        let blocks = []
        day.preferences.forEach(p => {
            blocks.push(new PreferenceBlock(
                x + p.timePeriod.start.toDayPercentage()*w,
                x + p.timePeriod.finish.toDayPercentage()*w,
                y1,
                y2,
                PreferenceType.toColor(p.type)
            ))
        })
        return blocks
    }
}