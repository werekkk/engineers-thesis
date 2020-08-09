package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.Employer
import jwer.pracainzynierskabackend.model.entity.Position
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface EmployeeRepository : JpaRepository<Employee, Long> {

    fun getById(employeeId: Long): Employee?

    fun findAllByWorkplaceId(workplaceId: Long): List<Employee>

    fun findByInvitationToken(invitationToken: String): Employee?

    @Query("SELECT e FROM Employee e WHERE e.account.id = ?1 AND e.workplace.id = ?2")
    fun findByAccountIdAndWorkplaceId(accountId: Long, workplaceId: Long): Employee?

}