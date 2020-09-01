package jwer.schedulegenerator

import jwer.schedulegenerator.generator.GeneratorConfig
import jwer.schedulegenerator.generator.ScheduleGenerator
import jwer.schedulegenerator.generator.model.Employee
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
        val schedule = Schedule(
                GeneratorConfig(listOf(
                        Employee(1, listOf(), arrayOf(0,0,0,0,0,0)),
                        Employee(2, listOf(), arrayOf(0,0,0,0,0,0)),
                        Employee(4, listOf(), arrayOf(0,0,0,0,0,0))
                ), listOf(),1, 6),
                arrayOf(
                        arrayOf(null,1,null,3,null,2),
                        arrayOf(1,1,null,null,null,3),
                        arrayOf(0,2,2,1,null,2)
                ))
        println(schedule.toString())
        assert(schedule.toString() == "1: [010302]\n2: [110003]\n4: [022102]")
    }


}