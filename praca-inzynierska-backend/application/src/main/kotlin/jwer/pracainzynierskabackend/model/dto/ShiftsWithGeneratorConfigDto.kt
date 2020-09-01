package jwer.pracainzynierskabackend.model.dto

data class ShiftsWithGeneratorConfigDto(
        val shifts: ShiftsDto,
        val generatorConfig: GeneratorConfigDto
)