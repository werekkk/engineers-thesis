package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Shift
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface ShiftRepository : JpaRepository<Shift, Long> {

    @Query("SELECT s FROM Shift s JOIN Position p ON s.position.id = p.id WHERE p.id = ?1 AND s.period.finish >= ?2 AND s.period.start < ?3")
    fun getShiftsByPositionAndPeriod(positionId: Long, start: LocalDateTime, finish: LocalDateTime): List<Shift>

    @Query("SELECT s FROM Shift s WHERE s.employee.id = ?1 AND s.period.finish >= ?2 AND s.period.start < ?3")
    fun getShiftsByEmployeeAndPeriod(employeeId: Long, start: LocalDateTime, finish: LocalDateTime): List<Shift>

    @Query("SELECT s FROM Shift s WHERE s.employee.id = ?1 AND NOT (s.period.finish < ?2 OR s.period.start > ?3)")
    fun getOverlappingShifts(employeeId: Long, start: LocalDateTime, finish: LocalDateTime): List<Shift>

    fun getById(shiftId: Long): Shift?

    @Query("SELECT s FROM Shift s WHERE s.position.id = ?1")
    fun getAllByPositionId(positionId: Long): List<Shift>

    @Query("SELECT s FROM Shift s WHERE s.employee.id = ?1")
    fun getAllByEmployeeId(employeeId: Long): List<Shift>

    @Query("SELECT s FROM Shift s WHERE s.employee.workplace.id = ?1 AND s.period.start >= ?2 AND s.period.finish <= ?3")
    fun getAllByWorkplaceIdAndPeriod(workplaceId: Long, start: LocalDateTime, finish: LocalDateTime): List<Shift>

    @Query("SELECT s FROM Shift s WHERE s.position.id = ?1 AND s.employee.id = ?2")
    fun getAllByPositionIdAndEmployeeId(positionId: Long, employeeId: Long): List<Shift>
}