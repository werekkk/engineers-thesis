package jwer.pracainzynierskabackend.model.embeddable

import java.time.LocalTime
import javax.persistence.Embeddable

@Embeddable
data class TimePeriod(
        var start: LocalTime,
        var finish: LocalTime
)