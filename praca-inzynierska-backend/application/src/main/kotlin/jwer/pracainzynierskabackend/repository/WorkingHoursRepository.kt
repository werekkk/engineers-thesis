package jwer.pracainzynierskabackend.repository

import jwer.pracainzynierskabackend.model.entity.WorkingHours
import org.springframework.data.jpa.repository.JpaRepository

interface WorkingHoursRepository : JpaRepository<WorkingHours, Long> {
}