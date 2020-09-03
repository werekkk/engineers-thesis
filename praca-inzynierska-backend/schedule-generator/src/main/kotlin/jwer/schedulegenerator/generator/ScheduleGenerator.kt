package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.springframework.stereotype.Service
import java.io.File
import kotlin.coroutines.coroutineContext
import kotlin.coroutines.suspendCoroutine

@Service
class ScheduleGenerator {

    companion object {
    }

    fun generate(config: GeneratorConfig): Schedule {
        File("sprzatajacy.json").writeText(
                Json.encodeToString(config)
        )
        println("tempFinish;tempStart;costMin;costMax;costAvg")
        val tempFinal: Double = 0.1
        val multiplier: Double = 1.1
        var tempStart: Double = tempFinal * multiplier
        while (tempStart < 1000) {
            val deferred = (1..100).map {
                GlobalScope.async {
                    cost(sa(config, tempStart = tempStart, tempFinal = tempFinal, log = false)).toDouble()
                }
            }
            runBlocking {
                var costs = deferred.map { it.await() }
                println("${tempFinal};${tempStart};${costs.sorted()[0]};${costs.sortedDescending()[0]};${costs.average()}")
            }
            tempStart *= multiplier
        }
        return sa(config)
    }

}