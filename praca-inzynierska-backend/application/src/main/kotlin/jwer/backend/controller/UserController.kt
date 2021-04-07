package jwer.backend.controller

import jwer.backend.model.dto.*
import jwer.backend.service.UserService
import jwer.backend.utils.ControllerUtils
import jwer.backend.utils.createResponse
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
        return userService.registerWorkplace(registerDetails).createResponse()
    }

    @GetMapping("/invitation/{invitationToken}")
    fun lookupInvitationToken(@PathVariable invitationToken: String): ResponseEntity<AccountDto> {
        return userService.findEmployeeAccountByInvitationToken(invitationToken).createResponse()
    }

    @PostMapping("/register-employee")
    fun registerEmployee(@RequestBody registerDetails: RegisterEmployeeDetailsDto): ResponseEntity<AccountResponseDto> {
        return userService.registerEmployee(registerDetails).createResponse()
    }

    @PostMapping("/change-details")
    fun changeAccountDetails(principal: Principal, @RequestBody newAccountDetails: ChangeAccountDetailsDto): ResponseEntity<AccountResponseDto> {
        return userService.changeAccountDetails(principal, newAccountDetails).createResponse()
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