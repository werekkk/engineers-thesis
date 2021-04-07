package jwer.backend.model.dto

data class SetPositionsDto(
        val employeeId: Long,
        val positionIds: List<Long>
)