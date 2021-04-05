package jwer.backend.repository

import jwer.backend.model.auth.Account
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<Account, Long>