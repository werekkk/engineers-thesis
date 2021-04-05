package jwer.backend.model.dto

import jwer.backend.model.entity.Position

data class PositionDto(
        val id: Long?,
        val name: String
) {
    constructor(position: Position)
    : this(position.id, position.name)

    fun validate(): Boolean {
        return name.length in 1..200
    }
}