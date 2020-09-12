package jwer.pracainzynierskabackend.model.embeddable

import jwer.pracainzynierskabackend.utils.createResponse
import jwer.pracainzynierskabackend.utils.isSavedAsMidnight
import jwer.pracainzynierskabackend.utils.totalMinutesInDay
import java.time.LocalDateTime
import javax.persistence.Embeddable

@Embeddable
data class DateTimePeriod(
        var start: LocalDateTime,
        var finish: LocalDateTime
) {

    fun hours(): Double = (finish.totalMinutesInDay() - start.totalMinutesInDay()) / 60.0

}