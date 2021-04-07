package jwer.backend.model.entity

import jwer.backend.model.dto.HourPreferenceDto
import jwer.backend.model.embeddable.TimePeriod
import javax.persistence.*

@Entity
data class HourPreference(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "hour_preference_id")
        val id: Long = 0,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "preferences_day_id")
        val day: PreferencesDay,

        @Column(name = "preference_type")
        val type: PreferenceType,

        @Embedded
        @Column(name = "period")
        val period: TimePeriod
) {
        constructor(hp: HourPreferenceDto, day: PreferencesDay) : this(
                0, day, hp.type, hp.timePeriod
        )
}