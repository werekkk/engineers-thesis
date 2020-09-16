package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.RequiredStaffDto
import jwer.pracainzynierskabackend.service.RequiredStaffService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import jwer.pracainzynierskabackend.utils.createResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/staff-requirements")
class RequiredStaffController @Autowired constructor(
        private val requiredStaffService: RequiredStaffService
){

    @GetMapping("/position/{id}")
    fun getRequiredStaffByPositionId(principal: Principal, @PathVariable id: Long): ResponseEntity<RequiredStaffDto> {
        return requiredStaffService.getRequiredStaffByPrincipalAndPositionId(principal, id).createResponse()
    }

    @PostMapping("/position/{id}")
    fun saveRequiredStaffByPositionId(
            principal: Principal, @PathVariable id: Long, @RequestBody requirements: RequiredStaffDto): ResponseEntity<RequiredStaffDto> {
        return requiredStaffService.saveRequiredStaffByPrincipalAndPositionId(principal, id, requirements).createResponse()
    }

}