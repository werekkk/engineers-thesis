package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.auth.Account
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<Account, Long>