package jwer.backend.model.entity

import jwer.backend.model.dto.RequiredStaffDto
import javax.persistence.*

@Entity
data class RequiredStaff(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "required_staff_id")
        val id: Long = 0,

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "monday_staff_id")
        val mondayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "tuesday_staff_id")
        val tuesdayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "wednesday_staff_id")
        val wednesdayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "thursday_staff_id")
        val thursdayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "friday_staff_id")
        val fridayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "saturday_staff_id")
        val saturdayStaff: RequiredStaffDay = RequiredStaffDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "sunday_staff_id")
        val sundayStaff: RequiredStaffDay = RequiredStaffDay()
) {
        constructor(dto: RequiredStaffDto) : this (
                dto.id,
                RequiredStaffDay.fromDto(dto.mondayStaff),
                RequiredStaffDay.fromDto(dto.tuesdayStaff),
                RequiredStaffDay.fromDto(dto.wednesdayStaff),
                RequiredStaffDay.fromDto(dto.thursdayStaff),
                RequiredStaffDay.fromDto(dto.fridayStaff),
                RequiredStaffDay.fromDto(dto.saturdayStaff),
                RequiredStaffDay.fromDto(dto.sundayStaff)
        )
}