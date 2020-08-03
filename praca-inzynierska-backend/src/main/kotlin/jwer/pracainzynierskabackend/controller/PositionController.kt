package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.EmployeeDto
import jwer.pracainzynierskabackend.model.dto.PositionDto
import jwer.pracainzynierskabackend.model.dto.PositionsDto
import jwer.pracainzynierskabackend.model.dto.SetPositionsDto
import jwer.pracainzynierskabackend.service.PositionService
import jwer.pracainzynierskabackend.utils.*
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
        return ControllerUtils.createResponse(positionService.getPositionsDtoByEmployee(principal))
    }

    @PostMapping
    fun savePosition(principal: Principal, @RequestBody position: PositionDto): ResponseEntity<PositionDto> {
        return ControllerUtils.createResponse(positionService.savePosition(principal, position))
    }

    @DeleteMapping("/{id}")
    fun deletePosition(principal: Principal, @PathVariable("id") positionId: Long): ResponseEntity<PositionDto> {
        return ControllerUtils.createResponse(positionService.deletePosition(principal, positionId))
    }

    @PostMapping("/employee")
    fun setEmployeePositions(principal: Principal, @RequestBody positions: SetPositionsDto): ResponseEntity<EmployeeDto> {
        return ControllerUtils.createResponse(positionService.setEmployeePositions(principal, positions))
    }

    @GetMapping("/employee")
    fun getPositionByEmployeePrincipal(principal: Principal): ResponseEntity<PositionsDto> {
        TODO()
    }

}