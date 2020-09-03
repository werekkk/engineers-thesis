package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.springframework.stereotype.Service
import java.io.File

@Service
class ScheduleGenerator {

    companion object {
    }

    fun generate(config: GeneratorConfig): Schedule {
        return sa(config)
    }

}