package jwer.schedulegenerator

import jwer.schedulegenerator.generator.ConstraintedRandomScheduleGenerator
import jwer.schedulegenerator.generator.GeneratorConfig
import jwer.schedulegenerator.generator.RandomScheduleGenerator
import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.Position
import org.junit.jupiter.api.Test

class RandomScheduleGeneratorTests {

    companion object {
        private val POSITIONS_1 = listOf(
                Position(1, arrayOf(0,0,0,0,1,1,1,1,2,2,2,3,3,3,2,2,0,0,0)),
                Position(2, arrayOf(0,0,1,1,1,1,1,1,1,2,2,2,2,1,1,1,0,0,0)),
                Position(3, arrayOf(1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1))
        )
        private val EMPLOYEES_1 = listOf(
                Employee(1, listOf(POSITIONS_1[0]),
                        arrayOf(3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,1,1,1)),
                Employee(2, listOf(POSITIONS_1[0]),
                        arrayOf(1,1,1,1,2,2,2,2,3,3,3,3,1,1,1,1,1,0,0)),
                Employee(3, listOf(POSITIONS_1[0], POSITIONS_1[2]),
                        arrayOf(0,0,0,0,0,3,3,3,3,3,3,3,3,2,2,2,2,2,2)),
                Employee(4, listOf(POSITIONS_1[1], POSITIONS_1[2]),
                        arrayOf(3,3,3,3,3,2,2,2,2,2,2,1,1,1,1,1,0,0,0)),
                Employee(5, listOf(POSITIONS_1[1]),
                        arrayOf(2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,2,2,2,0))
        )
        private val CONFIGURATION_1 = GeneratorConfig(
                EMPLOYEES_1, POSITIONS_1, 1, 19
        )
    }

    @Test
    fun testRandomScheduleGeneration() {
        println(CONFIGURATION_1.withScheduleToString(RandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(RandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(RandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(RandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(RandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        assert(true)
    }

    @Test
    fun testConstrainedRandomScheduleGenerator() {
        repeat(1000) {
            val generatedSchedule = ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)
            assert(generatedSchedule.isValidWithEmployeePreferences(EMPLOYEES_1))
        }
        println(CONFIGURATION_1.withScheduleToString(ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
        println(CONFIGURATION_1.withScheduleToString(ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)))
        println()
    }

    @Test
    fun findExistingCompleteSchedule() {
        repeat(100000) {
            val generatedSchedule = ConstraintedRandomScheduleGenerator.generate(CONFIGURATION_1)
            if (generatedSchedule.isComplete(CONFIGURATION_1)) {
                assert(true)
                println(CONFIGURATION_1.withScheduleToString(generatedSchedule))
                return@findExistingCompleteSchedule
            }
        }
        assert(false)
    }


}