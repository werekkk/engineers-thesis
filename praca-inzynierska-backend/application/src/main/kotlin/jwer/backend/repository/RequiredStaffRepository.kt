package jwer.backend.repository

import jwer.backend.model.entity.RequiredStaff
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface RequiredStaffRepository : JpaRepository<RequiredStaff, Long> {

    @Query("SELECT rs FROM RequiredStaff rs JOIN Position p ON p.requiredStaff.id = rs.id JOIN Credentials c ON c.account.id = p.workplace.employer.account.id WHERE p.id = ?1 AND c.username = ?2")
    fun findByPositionIdAndEmployerUsername(positionId: Long, username: String) : RequiredStaff?

}