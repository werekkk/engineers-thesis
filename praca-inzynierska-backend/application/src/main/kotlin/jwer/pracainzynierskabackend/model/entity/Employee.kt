package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.auth.Account
import java.time.LocalDate
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

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "workplace_id")
        val workplace: Workplace,

        @ManyToMany(fetch = FetchType.EAGER)
        val positions: List<Position>,

        @Column(name = "invitation_token", nullable = true, unique = true)
        var invitationToken: String?,

        @Column(name = "employee_status")
        var employeeStatus: EmployeeStatus,

        @OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], mappedBy = "employee")
        val oneTimeHourPreferences: MutableList<OneTimeHourPreference> = mutableListOf(),

        @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        @JoinColumn(name = "preferences_week_id")
        val preferencesWeek: PreferencesWeek = PreferencesWeek()
) {
        companion object {
                const val INVITATION_TOKEN_LENGTH = 50
        }

        override fun toString(): String {
                return "<Employer>{id: ${id}; account:${account}; workplace: {id: ${workplace.id}; name: ${workplace.name}; ...}}"
        }
}