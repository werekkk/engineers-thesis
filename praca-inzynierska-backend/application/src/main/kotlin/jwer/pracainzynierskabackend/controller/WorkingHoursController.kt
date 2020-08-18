package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.WorkingHoursDto
import jwer.pracainzynierskabackend.service.WorkingHoursService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/working-hours")
class WorkingHoursController @Autowired constructor(
        private val workingHoursService: WorkingHoursService
){

    @GetMapping
    fun getWorkingHours(principal: Principal): ResponseEntity<WorkingHoursDto> {
        return ControllerUtils.createResponse(workingHoursService.getWorkingHours(principal))
    }

    @PostMapping
    fun setWorkingHours(principal: Principal, @RequestBody workingHours: WorkingHoursDto): ResponseEntity<WorkingHoursDto> {
        return ControllerUtils.createResponse(workingHoursService.setWorkingHours(principal, workingHours))
    }
}