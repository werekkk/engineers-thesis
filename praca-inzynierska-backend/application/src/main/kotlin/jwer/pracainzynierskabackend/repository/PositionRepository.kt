package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.Position
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PositionRepository : JpaRepository<Position, Long> {

    @Query("SELECT p FROM Position p JOIN Credentials c ON p.workplace.employer.account.id = c.account.id WHERE c.username = ?1")
    fun getPositionByEmployerUsername(username: String): List<Position>

    @Query("SELECT e.positions FROM Employee e JOIN Credentials c ON e.account.id = c.account.id WHERE c.username = ?1")
    fun getEmployeePositionsByUsername(username: String): List<Position>

    fun getById(id: Long): Position?

    @Query("SELECT e FROM Employee e JOIN e.positions p WHERE p.id = ?1")
    fun getEmployeesByPosition(positionId: Long): List<Employee>
}