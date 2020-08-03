package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.auth.Account
import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class Employee(
        @Id
        @Column(name = "account_id")
        val id: Long,

        @MapsId("account_id")
        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        @JoinColumn(name = "account_id")
        val account: Account,

        @Column(name = "employment_date")
        val employmentDate: LocalDate?,
        @Column(name = "discharge_date")
        var dischargeDate: LocalDate?,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "workplace_id")
        val workplace: Workplace,

        @ManyToMany(fetch = FetchType.EAGER, mappedBy = "employees")
        val positions: List<Position>,

        @Column(name = "invitation_token", nullable = true, unique = true)
        var invitationToken: String?,

        @Column(name = "employee_status")
        var employeeStatus: EmployeeStatus
) {
        companion object {
                const val INVITATION_TOKEN_LENGTH = 50
        }
}