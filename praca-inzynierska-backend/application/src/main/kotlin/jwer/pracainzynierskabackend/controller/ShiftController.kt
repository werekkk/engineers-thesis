package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.SavedShiftResponseDto
import jwer.pracainzynierskabackend.model.dto.ShiftDto
import jwer.pracainzynierskabackend.model.dto.ShiftsDto
import jwer.pracainzynierskabackend.model.dto.ShiftsWithGeneratorConfigDto
import jwer.pracainzynierskabackend.service.ShiftService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import jwer.pracainzynierskabackend.utils.createResponse
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
        return shiftService.getShiftsByPosition(principal, positionId, firstDay, days).createResponse()
    }

    @GetMapping("/employee")
    fun getShiftsByEmployee(
            principal: Principal,
            @RequestParam(name = "firstDay") @DateTimeFormat(pattern = "ddMMyyyy") firstDay: LocalDate,
            @RequestParam(name = "days", defaultValue = "7") days: Int): ResponseEntity<ShiftsDto> {
        return shiftService.getEmployeeShifts(principal, firstDay, days).createResponse()
    }

    @PostMapping()
    fun saveShift(principal: Principal, @RequestBody shift: ShiftDto): ResponseEntity<SavedShiftResponseDto> {
        return shiftService.saveShift(principal, shift).createResponse()
    }

    @PostMapping("/generated")
    fun saveShifts(principal: Principal, @RequestBody shifts: ShiftsWithGeneratorConfigDto): ResponseEntity<ShiftsDto> {
        return shiftService.saveGeneratedShifts(principal, shifts).createResponse()
    }

    @DeleteMapping("/{id}")
    fun deleteShift(principal: Principal, @PathVariable("id") shiftId: Long): ResponseEntity<ShiftDto> {
        return shiftService.deleteShift(principal, shiftId).createResponse()
    }

}