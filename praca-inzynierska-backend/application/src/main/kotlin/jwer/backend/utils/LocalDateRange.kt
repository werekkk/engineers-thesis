package jwer.backend.utils

import java.time.LocalDate

operator fun ClosedRange<LocalDate>.iterator(): Iterator<LocalDate> {
    return LocalDateIterator(start, endInclusive)
}

class LocalDateIterator(
        val start: LocalDate,
        val endInclusive: LocalDate) : Iterator<LocalDate> {

    var currentValue = start

    override fun hasNext(): Boolean {
        return currentValue <= endInclusive
    }

    override fun next(): LocalDate {
        currentValue = currentValue.plusDays(1)
        return currentValue.minusDays(1)
    }

}