package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.GeneratorConfig
import jwer.schedulegenerator.generator.model.Schedule
import org.springframework.stereotype.Service

@Service
class ScheduleGenerator {

    fun generate(config: GeneratorConfig): Schedule {
        return sa(config)
    }

}