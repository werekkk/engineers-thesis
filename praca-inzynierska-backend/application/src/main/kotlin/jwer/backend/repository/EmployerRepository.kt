package jwer.backend.repository

import jwer.backend.model.entity.Employer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface EmployerRepository : JpaRepository<Employer, Long> {

    @Query("SELECT e FROM Employer e JOIN Credentials c ON c.account.id = e.account.id WHERE c.username = ?1")
    fun findByUsername(username: String): Employer?

}