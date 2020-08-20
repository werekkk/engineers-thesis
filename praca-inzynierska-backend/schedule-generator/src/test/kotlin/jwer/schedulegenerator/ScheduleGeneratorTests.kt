package jwer.schedulegenerator

import jwer.schedulegenerator.generator.GeneratorConfig
import jwer.schedulegenerator.generator.ScheduleGenerator
import jwer.schedulegenerator.generator.model.Schedule
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ScheduleGeneratorTests @Autowired constructor(
        private val generator: ScheduleGenerator
) {

    companion object {

        @SpringBootApplication
        open class TestConfiguration {}

    }

    @Test
    fun scheduleToString() {
        val schedule = Schedule(mapOf(
                Pair(4, arrayOf(0,2,2,1,null,2)),
                Pair(2, arrayOf(1,1,null,null,null,3)),
                Pair(1, arrayOf(null,1,null,3,null,2))
        ), GeneratorConfig(listOf(), listOf(),1, 1, 1))
        println(schedule.toString())
        assert(schedule.toString() == "1: [010302]\n2: [110003]\n4: [022102]")
    }


}