package jwer.backend.model.embeddable

import java.time.LocalDate
import java.time.LocalTime
import javax.persistence.Embeddable

@Embeddable
data class TimePeriod(
        var start: LocalTime,
        var finish: LocalTime
) {

    fun atDate(date: LocalDate): DateTimePeriod {
        return DateTimePeriod(
                start.atDate(date),
                finish.atDate(date)
        )
    }

}