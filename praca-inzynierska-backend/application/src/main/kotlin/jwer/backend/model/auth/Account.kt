package jwer.backend.model.auth

import jwer.backend.model.dto.AddEmployeeDto
import javax.persistence.*

@Entity
data class Account(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "account_id")
        val id: Long,

        @Column(name = "first_name", nullable = false)
        val firstName: String,
        @Column(name = "last_name", nullable = false)
        val lastName: String,

        @Column(name = "account_type")
        val accountType: AccountType
){
        constructor(ed: AddEmployeeDto): this(
                0,
                ed.firstName,
                ed.lastName,
                AccountType.EMPLOYEE
        )
}

