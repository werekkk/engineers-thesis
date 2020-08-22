package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Employee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface EmployeeRepository : JpaRepository<Employee, Long> {

    fun getById(employeeId: Long): Employee?

    fun findAllByWorkplaceId(workplaceId: Long): List<Employee>

    fun findByInvitationToken(invitationToken: String): Employee?

    @Query("SELECT e FROM Employee e WHERE e.account.id = ?1 AND e.workplace.id = ?2")
    fun findByAccountIdAndWorkplaceId(accountId: Long, workplaceId: Long): Employee?

    @Query("SELECT e FROM Employee e JOIN Credentials c ON e.workplace.employer.account.id = c.account.id WHERE e.id = ?1 AND c.username = ?2")
    fun findByEmployeeIdAndEmployerUsername(employeeId: Long, employerUsername: String): Employee?

    @Query("SELECT e FROM Employee e JOIN Credentials c ON e.account.id = c.account.id WHERE c.username = ?1")
    fun findByUsername(username: String): Employee?

}