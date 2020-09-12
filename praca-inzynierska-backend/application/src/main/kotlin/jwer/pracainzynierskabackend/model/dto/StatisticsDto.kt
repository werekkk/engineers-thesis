package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Shift

data class StatisticsDto(
        val monthNumber: Int?,
        var shifts: Int = 0,
        var hours: Double = 0.0
) {

    operator fun plusAssign(shift: Shift) {
        shifts++
        hours += shift.period.hours()
    }

    operator fun plusAssign(other: StatisticsDto) {
        shifts += other.shifts
        hours += other.hours
    }

}