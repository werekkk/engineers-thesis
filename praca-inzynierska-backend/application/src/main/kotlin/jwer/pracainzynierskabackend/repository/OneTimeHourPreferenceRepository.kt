package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.OneTimeHourPreference
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface OneTimeHourPreferenceRepository : JpaRepository<OneTimeHourPreference, Long> {

    @Query("SELECT o FROM OneTimeHourPreference o WHERE o.employee.id = ?1 AND o.period.start <= ?3 AND o.period.finish > ?2")
    fun findByEmployeeAndPeriod(employeeId: Long, start: LocalDateTime, finish: LocalDateTime): List<OneTimeHourPreference>

}