package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.AccountDto
import jwer.pracainzynierskabackend.model.dto.RegisterWorkplaceDetailsDto
import jwer.pracainzynierskabackend.service.AuthenticationService
import jwer.pracainzynierskabackend.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping(path = ["/auth"])
class AuthenticationController @Autowired constructor(
        private val userService: UserService
) {

    @GetMapping("/authenticate")
    fun authenticate(principal: Principal): ResponseEntity<AccountDto> {
        return getUser(principal)
    }

    @GetMapping("/logout")
    fun logout() {
        SecurityContextHolder.getContext().authentication.isAuthenticated = false
    }

    @GetMapping("/user")
    fun getUser(principal: Principal?): ResponseEntity<AccountDto> {
        principal?.let {
            val account = userService.getAccount(principal)
            account?.let {
                return ResponseEntity.ok(it)
            }
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }
        return ResponseEntity(HttpStatus.OK)
    }
}