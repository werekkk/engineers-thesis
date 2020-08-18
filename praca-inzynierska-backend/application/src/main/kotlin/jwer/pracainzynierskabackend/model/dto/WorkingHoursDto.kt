package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
import jwer.pracainzynierskabackend.model.entity.WorkingHours

data class WorkingHoursDto(
        val monday: TimePeriod?,
        val tuesday: TimePeriod?,
        val wednesday: TimePeriod?,
        val thursday: TimePeriod?,
        val friday: TimePeriod?,
        val saturday: TimePeriod?,
        val sunday: TimePeriod?
) {
    constructor(wh: WorkingHours) :
            this(
                    wh.monday,
                    wh.tuesday,
                    wh.wednesday,
                    wh.thursday,
                    wh.friday,
                    wh.saturday,
                    wh.sunday
            )
}