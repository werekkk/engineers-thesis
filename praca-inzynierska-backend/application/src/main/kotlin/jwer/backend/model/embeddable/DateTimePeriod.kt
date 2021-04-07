package jwer.backend.model.embeddable

import jwer.backend.utils.totalMinutesInDay
import java.time.LocalDateTime
import javax.persistence.Embeddable

@Embeddable
data class DateTimePeriod(
        var start: LocalDateTime,
        var finish: LocalDateTime
) {

    fun hours(): Double = (finish.totalMinutesInDay() - start.totalMinutesInDay()) / 60.0

}