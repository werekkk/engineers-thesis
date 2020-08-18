package jwer.schedulegenerator

import jwer.schedulegenerator.generator.ScheduleGenerator
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
    fun helloTest() {
        assert(generator.hello() == "Hello from generator")
    }


}