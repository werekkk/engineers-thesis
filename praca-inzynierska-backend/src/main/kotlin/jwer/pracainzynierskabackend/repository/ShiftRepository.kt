package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.Shift
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.sql.Date
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.OffsetDateTime

interface ShiftRepository : JpaRepository<Shift, Long> {

    @Query("SELECT s FROM Shift s JOIN Position p ON s.position.id = p.id WHERE p.id = ?1 AND s.period.finish >= ?2 AND s.period.start < ?3")
    fun getShiftsByPositionAndPeriod(positionId: Long, start: LocalDateTime, finish: LocalDateTime): List<Shift>

    fun getById(shiftId: Long): Shift?

}