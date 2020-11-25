package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.GeneratorConfigDto
import jwer.pracainzynierskabackend.model.dto.ShiftsDto
import jwer.pracainzynierskabackend.service.ScheduleGeneratorService
import jwer.pracainzynierskabackend.utils.createResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/schedule-generator")
class ScheduleGeneratorController @Autowired constructor(
        private val scheduleGeneratorService: ScheduleGeneratorService
) {

    @PostMapping
    fun generate(employer: Principal, @RequestBody config: GeneratorConfigDto): ResponseEntity<ShiftsDto> {
        return scheduleGeneratorService.generateSchedule(
                employer,
                config
        ).createResponse()
    }

}