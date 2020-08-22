package jwer.pracainzynierskabackend.model

import jwer.pracainzynierskabackend.model.embeddable.DateTimePeriod
import jwer.pracainzynierskabackend.service.ScheduleGeneratorService
import jwer.pracainzynierskabackend.utils.totalMinutesInDay
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit

class TimePointArray<T> constructor(
        private val start: LocalDate,
        finish: LocalDate,
        private val transform: (T) -> Int,
        existingArray: Array<Int>? = null,
        initialValue: Int = 0
) {

    companion object {

        fun timePointToDate(start: LocalDate, timePoint: Int): LocalDateTime {
            val days = timePoint / ScheduleGeneratorService.TIME_POINTS_PER_DAY
            val minutePoint = timePoint % ScheduleGeneratorService.TIME_POINTS_PER_DAY
            return start.plusDays(days.toLong()).atStartOfDay().plusMinutes(minutePoint.toLong() * ScheduleGeneratorService.TIME_STEP_IN_MINUTES)
        }

    }

    private val dayCount = ChronoUnit.DAYS.between(start, finish) + 1
    val array: Array<Int> = existingArray ?: Array(dayCount.toInt() * ScheduleGeneratorService.TIME_POINTS_PER_DAY) { initialValue }

    operator fun set(period: DateTimePeriod, newValue: T) {
        add(newValue, period)
    }

    operator fun set(start: LocalDateTime, finish: LocalDateTime, newValue: T) {
        add(newValue, start, finish)
    }

    /**
     * 0:00 - 0:05 -> [1,0,...]
     * @param period.start (inclusive)
     * @param period.finish (exclusive)
     */
    fun add(newValue: T, period: DateTimePeriod) {
        add(newValue, period.start, period.finish)
    }

    fun add(newValue: T, periodStart: LocalDateTime, periodFinish: LocalDateTime) {
        val start = dateToIndex(periodStart)
        val finish = dateToIndex(periodFinish)
        val numVal = transform(newValue)
        for (i in start..finish) {
            array[i] = numVal
        }
    }

    private fun dateToIndex(date: LocalDateTime): Int {
        val dateDiff = ChronoUnit.DAYS.between(start, date).toInt()
        val minutes = date.totalMinutesInDay()
        return dateDiff * ScheduleGeneratorService.TIME_POINTS_PER_DAY +
                minutes / ScheduleGeneratorService.TIME_STEP_IN_MINUTES
    }


}