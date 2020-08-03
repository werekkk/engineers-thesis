package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
import java.time.LocalTime
import javax.persistence.*

@Entity
data class WorkingHours(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "working_hours_id")
        val id: Long,

        @Embedded
        @Column(name = "monday")
        var monday: TimePeriod? = null,
        @Embedded
        @Column(name = "tuesday")
        var tuesday: TimePeriod? = null,
        @Embedded
        @Column(name = "wednesday")
        var wednesday: TimePeriod? = null,
        @Embedded
        @Column(name = "thursday")
        var thursday: TimePeriod? = null,
        @Embedded
        @Column(name = "friday")
        var friday: TimePeriod? = null,
        @Embedded
        @Column(name = "saturday")
        var saturday: TimePeriod? = null,
        @Embedded
        @Column(name = "sunday")
        var sunday: TimePeriod? = null
)