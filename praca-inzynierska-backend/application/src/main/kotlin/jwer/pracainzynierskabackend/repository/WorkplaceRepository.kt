package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Workplace
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface WorkplaceRepository : JpaRepository<Workplace, Long> {

    @Query("SELECT w FROM Workplace w JOIN Employee e ON w.id = e.workplace.id JOIN Credentials c ON c.account.id = e.account.id WHERE c.username = ?1")
    fun findByEmployeeUsername(employeeUsername: String): Workplace?

    @Query("SELECT w FROM Workplace w JOIN Credentials c ON c.account.id = w.employer.account.id WHERE c.username = ?1")
    fun findByEmployerUsername(employerUsername: String): Workplace?
}