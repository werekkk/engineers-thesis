package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.PreferencesWeek
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PreferencesWeekRepository : JpaRepository<PreferencesWeek, Long> {

    @Query("SELECT pw FROM PreferencesWeek pw JOIN Employee e ON e.preferencesWeek.id = pw.id WHERE e.id = ?1")
    fun findByEmployeeId(employeeId: Long): PreferencesWeek?

}