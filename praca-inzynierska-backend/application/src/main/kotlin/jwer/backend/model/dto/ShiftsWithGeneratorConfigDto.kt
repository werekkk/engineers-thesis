package jwer.backend.model.dto

data class ShiftsWithGeneratorConfigDto(
        val shifts: ShiftsDto,
        val generatorConfig: GeneratorConfigDto
)