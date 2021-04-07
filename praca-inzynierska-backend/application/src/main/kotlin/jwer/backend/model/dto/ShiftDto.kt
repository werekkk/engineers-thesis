package jwer.backend.model.dto

import jwer.backend.model.entity.Shift
import jwer.backend.model.entity.ShiftType
import java.time.LocalDateTime

data class ShiftDto (
        val id: Long = 0,
        val employeeId: Long,
        val positionId: Long,
        var start: LocalDateTime,
        var finish: LocalDateTime,
        val creationDate: LocalDateTime?,
        val shiftType: ShiftType?
) {
    constructor(s: Shift)
    : this(s.id, s.employee.id, s.position.id, s.period.start, s.period.finish, s.creationDate, s.shiftType)

    fun boundOverlap(other: ShiftDto): Boolean {
        return start == other.finish || finish == other.start
    }
}