package jwer.backend.controller

import jwer.backend.model.dto.EmployeeDto
import jwer.backend.model.dto.PositionDto
import jwer.backend.model.dto.PositionsDto
import jwer.backend.model.dto.SetPositionsDto
import jwer.backend.service.PositionService
import jwer.backend.utils.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/position")
class PositionController @Autowired constructor(
        private val positionService: PositionService
) {

    @GetMapping("/all")
    fun getAllPositions(principal: Principal): ResponseEntity<PositionsDto> {
        return positionService.getPositionsDtoByEmployer(principal).createResponse()
    }

    @GetMapping("/employee")
    fun getEmployeePositions(principal: Principal): ResponseEntity<PositionsDto> {
        return positionService.getEmployeePositions(principal).createResponse()
    }

    @PostMapping
    fun savePosition(principal: Principal, @RequestBody position: PositionDto): ResponseEntity<PositionDto> {
        return positionService.savePosition(principal, position).createResponse()
    }

    @DeleteMapping("/{id}")
    fun deletePosition(principal: Principal, @PathVariable("id") positionId: Long): ResponseEntity<PositionDto> {
        return positionService.deletePosition(principal, positionId).createResponse()
    }

    @PostMapping("/employee")
    fun setEmployeePositions(principal: Principal, @RequestBody positions: SetPositionsDto): ResponseEntity<EmployeeDto> {
        return positionService.setEmployeePositions(principal, positions).createResponse()
    }

}