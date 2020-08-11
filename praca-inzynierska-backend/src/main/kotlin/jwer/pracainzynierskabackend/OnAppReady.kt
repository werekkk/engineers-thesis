package jwer.pracainzynierskabackend

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class OnAppReady @Autowired constructor(
        private val databaseUpdate: DatabaseUpdate,
        private val sampleData: SampleData
) {

    @EventListener
    fun appReady(event: ApplicationReadyEvent) {
        println("Initialization started...")
        databaseUpdate.updateDatabase()
        sampleData.initSampleData()
        println("Initialization finished.")
    }

}