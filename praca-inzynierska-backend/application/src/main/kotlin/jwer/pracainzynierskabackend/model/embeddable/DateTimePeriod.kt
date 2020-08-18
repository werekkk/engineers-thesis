package jwer.pracainzynierskabackend.model.embeddable

import java.time.LocalDateTime
import javax.persistence.Embeddable

@Embeddable
data class DateTimePeriod(
        var start: LocalDateTime,
        var finish: LocalDateTime
)