package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.auth.AccountRole
import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.auth.Credentials
import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.model.entity.*
import jwer.pracainzynierskabackend.repository.CredentialsRepository
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import jwer.pracainzynierskabackend.repository.EmployerRepository
import org.apache.commons.validator.routines.EmailValidator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.Principal
import java.time.LocalDateTime
import javax.transaction.Transactional

@Service
class UserService @Autowired constructor(
        private val authenticationService: AuthenticationService,
        private val credentialsRepository: CredentialsRepository,
        private val employerRepository: EmployerRepository,
        private val employeeRepository: EmployeeRepository,
        private val passwordEncoder: PasswordEncoder
) {

    fun getAccount(principal: Principal): AccountDto {
        val credentials = authenticationService
                .loadUserByUsername(principal.name)
                .credentials
        return AccountDto(credentials, credentials.account)
    }

    fun getAccountType(principal: Principal): AccountType {
        return getAccount(principal).accountType
    }

    @Transactional
    fun registerWorkplace(registerDetails: RegisterWorkplaceDetailsDto): RegisterResponseDto {
        when {
            !registerDetails.isValid() -> return RegisterResponseDto(RegisterError.INVALID_FIELDS)
            !EmailValidator.getInstance().isValid(registerDetails.employer.email) -> return RegisterResponseDto(RegisterError.INVALID_EMAIL)
            authenticationService.userWithUsernameExists(registerDetails.employer.username) -> return RegisterResponseDto(RegisterError.USERNAME_TAKEN)
            authenticationService.userWithEmailExists(registerDetails.employer.email) -> return RegisterResponseDto(RegisterError.EMAIL_TAKEN)
        }

        val employerDetails = registerDetails.employer
        val encodedPassword = passwordEncoder.encode(employerDetails.password)

        val employerCredentials = Credentials(0,
                employerDetails.username,
                encodedPassword,
                employerDetails.email,
                Account(0,
                        employerDetails.firstName,
                        employerDetails.middleName,
                        employerDetails.lastName,
                        LocalDateTime.now(),
                        AccountType.EMPLOYER
                ),
                mutableListOf()
        )
        employerCredentials.accountRoles.add(AccountRole(0, employerCredentials, AccountRole.EMPLOYER))

        val savedCredentials = credentialsRepository.save(employerCredentials)
        val workplace = Workplace(0, registerDetails.workplaceName, null, listOf(), listOf())
        val employer = Employer(savedCredentials.account.id, savedCredentials.account, workplace)
        workplace.employer = employer

        val savedEmployer = employerRepository.save(employer)

        return RegisterResponseDto(
            account = AccountDto(
                savedCredentials,
                savedEmployer.account
            )
        )
    }

    @Transactional
    fun registerEmployee(registerDetails: RegisterEmployeeDetailsDto): AccountDto? {
        findEmployeeByInvitationToken(registerDetails.invitationToken)?.let {
            if (!credentialsRepository.existsByUsernameOrEmail(registerDetails.username, registerDetails.email)) {
                val employeeCredentials = Credentials(
                        0,
                        registerDetails.username,
                        passwordEncoder.encode(registerDetails.password),
                        registerDetails.email,
                        it.account,
                        mutableListOf()
                )
                employeeCredentials.accountRoles.add(AccountRole(0, employeeCredentials, AccountRole.EMPLOYEE))

                it.employeeStatus = EmployeeStatus.HAS_ACCOUNT
                it.invitationToken = null

                val savedCredentials = credentialsRepository.save(employeeCredentials)
                val savedEmployee = employeeRepository.save(it)
                return AccountDto(savedCredentials, savedEmployee.account)
            }
        }
        return null
    }

    fun findEmployeeByInvitationToken(invitationToken: String): Employee? {
        return employeeRepository.findByInvitationToken(invitationToken)
    }

    fun findEmployeeAccountByInvitationToken(invitationToken: String): AccountDto? {
        findEmployeeByInvitationToken(invitationToken)?.let {
            return AccountDto(it.account, AccountType.EMPLOYEE)
        }
        return null
    }

}