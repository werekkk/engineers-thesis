package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.Position
import kotlinx.serialization.Serializable

@Serializable
class SerializableGeneratorConfig (
        val employees: List<Employee>,
        val positions: List<Position>,
        val days: Int,
        val timePointsPerDay: Int
) {
    constructor(config: GeneratorConfig) :
            this(config.employees, config.positions, config.days, config.timePointsPerDay)

    fun toConfig(): GeneratorConfig {
        return GeneratorConfig(employees, positions, days, timePointsPerDay)
    }
}