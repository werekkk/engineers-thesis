package jwer.backend.model.entity

import jwer.backend.model.dto.RequiredStaffTimePeriodDto
import jwer.backend.model.embeddable.TimePeriod
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
        @Column(name = "period")
        val period: TimePeriod
) {
        constructor(dto: RequiredStaffTimePeriodDto, day: RequiredStaffDay)
        : this(dto.id, day, dto.employeeCount, dto.timePeriod)

        override fun toString(): String {
                return "<RequiredStaffTimePeriod>{id: ${id}; employeeCount: ${employeeCount}; day_id: ${day.id}; timePeriod: ${period}}"
        }
}