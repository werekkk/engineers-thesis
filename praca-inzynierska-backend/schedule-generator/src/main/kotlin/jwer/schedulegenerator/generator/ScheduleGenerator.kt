package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule
import org.springframework.stereotype.Service

@Service
class ScheduleGenerator {

    companion object {
    }

    fun generate(config: GeneratorConfig): Schedule {
        return ConstraintedRandomScheduleGenerator.generate(config)
        TODO()
    }

}