package jwer.backend.model.auth

import javax.persistence.*

@Entity
data class AccountRole(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "role_id")
        val id: Long,

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "credentials_id")
        val credentials: Credentials,

        @Column(name = "role_name", length = 10)
        val role: String
) {
        companion object {
                val EMPLOYER = "EMPLOYER"
                val EMPLOYEE = "EMPLOYEE"
        }
}