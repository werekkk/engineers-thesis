package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.service.UserService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/user")
class UserController @Autowired constructor(
        private val userService: UserService
){

    @PostMapping("/register-workplace")
    fun registerWorkplace(@RequestBody registerDetails: RegisterWorkplaceDetailsDto): ResponseEntity<AccountResponseDto> {
        return ControllerUtils.createResponse(userService.registerWorkplace(registerDetails))
    }

    @GetMapping("/invitation/{invitationToken}")
    fun lookupInvitationToken(@PathVariable invitationToken: String): ResponseEntity<AccountDto> {
        return ControllerUtils.createResponse(userService.findEmployeeAccountByInvitationToken(invitationToken))
    }

    @PostMapping("/register-employee")
    fun registerEmployee(@RequestBody registerDetails: RegisterEmployeeDetailsDto): ResponseEntity<AccountResponseDto> {
        return ControllerUtils.createResponse(userService.registerEmployee(registerDetails))
    }

    @PostMapping("/change-details")
    fun changeAccountDetails(principal: Principal, @RequestBody newAccountDetails: ChangeAccountDetailsDto): ResponseEntity<AccountResponseDto> {
        return ControllerUtils.createResponse(userService.changeAccountDetails(principal, newAccountDetails))
    }

    @PostMapping("/change-password")
    fun changePassword(principal: Principal, @RequestBody changePasswordDetails: ChangePasswordDto): ResponseEntity<AccountResponseDto> {
        return ControllerUtils.createResponse(userService.changePassword(principal, changePasswordDetails))
    }

    @DeleteMapping
    fun deleteAccount(principal: Principal): ResponseEntity<AccountDto> {
        return ControllerUtils.createResponse(userService.deleteAccount(principal))
    }
}