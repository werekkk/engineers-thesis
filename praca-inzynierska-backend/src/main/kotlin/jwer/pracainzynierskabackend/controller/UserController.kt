package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.dto.AccountDto
import jwer.pracainzynierskabackend.model.dto.RegisterEmployeeDetailsDto
import jwer.pracainzynierskabackend.model.dto.RegisterWorkplaceDetailsDto
import jwer.pracainzynierskabackend.service.UserService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
class UserController @Autowired constructor(
        private val userService: UserService
){

    @PostMapping("/register-workplace")
    fun registerWorkplace(@RequestBody registerDetails: RegisterWorkplaceDetailsDto): ResponseEntity<AccountDto> {
        return ControllerUtils.createResponse(userService.registerWorkplace(registerDetails))
    }

    @GetMapping("/invitation/{invitationToken}")
    fun lookupInvitationToken(@PathVariable invitationToken: String): ResponseEntity<AccountDto> {
        return ControllerUtils.createResponse(userService.findEmployeeAccountByInvitationToken(invitationToken))
    }

    @PostMapping("/register-employee")
    fun registerEmployee(@RequestBody registerDetails: RegisterEmployeeDetailsDto): ResponseEntity<Any> {
        userService.registerEmployee(registerDetails)?.let {
            return ResponseEntity(HttpStatus.OK)
        }
        return ResponseEntity(HttpStatus.BAD_REQUEST)
    }
}