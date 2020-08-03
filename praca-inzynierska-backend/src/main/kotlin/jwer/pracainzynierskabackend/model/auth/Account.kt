package jwer.pracainzynierskabackend.model.auth

import jwer.pracainzynierskabackend.model.dto.AddEmployeeDto
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class Account(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "account_id")
        val id: Long,

        @Column(name = "first_name", nullable = false)
        val firstName: String,
        @Column(name = "middle_name")
        val middleName: String?,
        @Column(name = "last_name", nullable = false)
        val lastName: String,

        @Column(name = "registration_date")
        val registrationDate: LocalDateTime,

        @Column(name = "account_type")
        val accountType: AccountType
){
        constructor(ed: AddEmployeeDto): this(
                0,
                ed.firstName,
                ed.middleName,
                ed.lastName,
                LocalDateTime.now(),
                AccountType.EMPLOYEE
        )
}

