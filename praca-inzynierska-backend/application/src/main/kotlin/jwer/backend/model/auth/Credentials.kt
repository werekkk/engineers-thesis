package jwer.backend.model.auth

import javax.persistence.*

@Entity
data class Credentials(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "credentials_id")
        val id: Long,

        @Column(name = "username", nullable = false, unique = true)
        val username: String,
        @Column(name = "password", nullable = false)
        var password: String,
        @Column(name = "email", nullable = false, unique = true)
        val email: String,

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "account_id", nullable = true, unique = true)
        val account: Account,

        @OneToMany(fetch = FetchType.EAGER, mappedBy = "credentials", cascade = [CascadeType.ALL])
        val accountRoles: MutableList<AccountRole>
) {
        fun withoutPassword(): Credentials = this.copy(password = "")
}