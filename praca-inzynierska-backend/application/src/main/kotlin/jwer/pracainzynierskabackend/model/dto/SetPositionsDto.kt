package jwer.pracainzynierskabackend.model.dto

data class SetPositionsDto(
        val employeeId: Long,
        val positionIds: List<Long>
)