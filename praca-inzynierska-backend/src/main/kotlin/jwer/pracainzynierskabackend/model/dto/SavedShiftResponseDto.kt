package jwer.pracainzynierskabackend.model.dto

data class SavedShiftResponseDto(
        val savedShift: ShiftDto,
        val deletedShiftsIds: List<Long>
)