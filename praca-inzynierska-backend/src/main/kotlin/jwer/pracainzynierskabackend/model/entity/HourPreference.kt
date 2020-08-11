package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.dto.HourPreferenceDto
import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
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

        @Column(name = "type")
        val type: PreferenceType,

        @Embedded
        @Column(name = "period")
        val period: TimePeriod
) {
        constructor(hp: HourPreferenceDto, day: PreferencesDay) : this(
                0, day, hp.type, hp.timePeriod
        )
}