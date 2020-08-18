package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.dto.RequiredStaffTimePeriodDto
import jwer.pracainzynierskabackend.model.embeddable.TimePeriod
import javax.persistence.*

@Entity
data class RequiredStaffTimePeriod(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "required_staff_time_period_id")
        val id: Long = 0,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "required_staff_day_id")
        val day: RequiredStaffDay,

        @Column(name = "employee_count")
        val employeeCount: Int,

        @Embedded
        @Column(name = "time_period")
        val timePeriod: TimePeriod
) {
        constructor(dto: RequiredStaffTimePeriodDto, day: RequiredStaffDay)
        : this(dto.id, day, dto.employeeCount, dto.timePeriod)

        override fun toString(): String {
                return "<RequiredStaffTimePeriod>{id: ${id}; employeeCount: ${employeeCount}; day_id: ${day.id}; timePeriod: ${timePeriod}}"
        }
}