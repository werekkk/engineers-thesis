package jwer.backend.model.entity

import jwer.backend.model.dto.RequiredStaffDayDto
import javax.persistence.*

@Entity
data class RequiredStaffDay(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "required_staff_day_id")
        val id: Long = 0,

        @OneToMany(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], mappedBy = "day", orphanRemoval = true)
        val timePeriods: MutableList<RequiredStaffTimePeriod> = mutableListOf()

) {
        companion object {
                fun fromDto(dto: RequiredStaffDayDto): RequiredStaffDay {
                        val rsd = RequiredStaffDay(dto.id)
                        dto.timePeriods.forEach {
                                rsd.timePeriods.add(
                                        RequiredStaffTimePeriod(it, rsd)
                                )
                        }
                        return rsd
                }
        }
}