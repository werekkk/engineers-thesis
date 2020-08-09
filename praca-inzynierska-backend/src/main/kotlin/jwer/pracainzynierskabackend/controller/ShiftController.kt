package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.ShiftDto
import jwer.pracainzynierskabackend.model.dto.ShiftsDto
import jwer.pracainzynierskabackend.service.ShiftService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.time.LocalDate

@RestController
@RequestMapping("/shift")
class ShiftController @Autowired constructor(
        private val shiftService: ShiftService
) {

    @GetMapping("/week")
    fun getShiftsByPosition(
            principal: Principal,
            @RequestParam(name = "positionId") positionId: Long,
            @RequestParam(name = "firstDay") @DateTimeFormat(pattern = "ddMMyyyy") firstDay: LocalDate,
            @RequestParam(name = "days", defaultValue = "7") days: Int): ResponseEntity<ShiftsDto> {
        return ControllerUtils.createResponse(shiftService.getShiftsByPosition(principal, positionId, firstDay, days))
    }

    @GetMapping("/employee")
    fun getShiftsByEmployee(
            principal: Principal,
            @RequestParam(name = "firstDay") @DateTimeFormat(pattern = "ddMMyyyy") firstDay: LocalDate,
            @RequestParam(name = "days", defaultValue = "7") days: Int): ResponseEntity<ShiftsDto> {
        return ControllerUtils.createResponse(shiftService.getEmployeeShifts(principal, firstDay, days))
    }

    @PostMapping()
    fun saveShift(principal: Principal, @RequestBody shift: ShiftDto): ResponseEntity<ShiftDto> {
        return ControllerUtils.createResponse(shiftService.saveShift(principal, shift))
    }

    @DeleteMapping("/{id}")
    fun deleteShift(principal: Principal, @PathVariable("id") shiftId: Long): ResponseEntity<ShiftDto> {
        return ControllerUtils.createResponse(shiftService.deleteShift(principal, shiftId))
    }

}