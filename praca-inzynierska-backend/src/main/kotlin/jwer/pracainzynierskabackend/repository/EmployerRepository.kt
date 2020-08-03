package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Employer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface EmployerRepository : JpaRepository<Employer, Long> {

    @Query("SELECT e FROM Employer e JOIN Credentials c ON c.account.id = e.account.id WHERE c.username = ?1")
    fun findByUsername(username: String): Employer?

}