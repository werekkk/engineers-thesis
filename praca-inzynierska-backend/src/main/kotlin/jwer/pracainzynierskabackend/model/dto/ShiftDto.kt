package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Shift
import jwer.pracainzynierskabackend.model.entity.ShiftType
import java.time.LocalDateTime

data class ShiftDto (
        val id: Long = 0,
        val employeeId: Long,
        val positionId: Long,
        val start: LocalDateTime,
        val finish: LocalDateTime,
        val creationDate: LocalDateTime?,
        val shiftType: ShiftType?
) {
    constructor(s: Shift)
    : this(s.id, s.employee.id, s.position.id, s.period.start, s.period.finish, s.creationDate, s.shiftType)
}