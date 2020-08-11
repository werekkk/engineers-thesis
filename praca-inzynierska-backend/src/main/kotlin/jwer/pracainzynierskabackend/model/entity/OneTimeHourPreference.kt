package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.embeddable.DateTimePeriod
import javax.persistence.*

@Entity
data class OneTimeHourPreference(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "one_time_hour_preference_id")
        val id: Long = 0,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id")
        val employee: Employee,

        @Column(name = "preference_type")
        val type: PreferenceType,

        @Embedded
        @Column(name = "time_period")
        val period: DateTimePeriod

)