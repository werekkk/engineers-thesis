package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.ShiftsDto
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.security.Principal
import java.time.LocalDate

@RestController
@RequestMapping("/shift")
class ShiftController {

    @GetMapping("/week")
    fun getShiftsByPositionAndWeek(
            principal: Principal,
            @RequestParam(name = "positionId") positionId: Long,
            @RequestParam(name = "firstDay") @DateTimeFormat(style = "ddMMyyyy") firstDay: LocalDate): ResponseEntity<ShiftsDto> {
        TODO()
    }

}