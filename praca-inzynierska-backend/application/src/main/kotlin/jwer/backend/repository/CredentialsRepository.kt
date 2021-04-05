package jwer.backend.repository

import jwer.backend.model.auth.Credentials
import org.springframework.data.jpa.repository.JpaRepository

interface CredentialsRepository : JpaRepository<Credentials, Long> {
    fun findByUsername(username: String): Credentials?
    fun findByEmail(email: String): Credentials?

    fun removeByAccountId(accountId: Long)
}