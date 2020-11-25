package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.StatisticsYearDto
import jwer.pracainzynierskabackend.service.StatisticsService
import jwer.pracainzynierskabackend.utils.createResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/statistics")
class StatisticsController @Autowired constructor(
        private val statisticsService: StatisticsService
){

    @GetMapping("/{year}")
    fun getYearStatistics(employerPrincipal: Principal, @PathVariable year: Int): ResponseEntity<StatisticsYearDto> {
        return statisticsService.getYearStatistics(employerPrincipal, year).createResponse()
    }

}