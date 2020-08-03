package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Position

data class PositionDto(
        val id: Long?,
        val name: String
) {
    constructor(position: Position)
    : this(position.id, position.name)
}