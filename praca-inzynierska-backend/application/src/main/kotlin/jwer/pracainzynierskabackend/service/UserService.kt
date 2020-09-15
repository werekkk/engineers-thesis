package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.auth.AccountRole
import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.auth.Credentials
import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.model.entity.*
import jwer.pracainzynierskabackend.repository.*
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
        private val accountRepository: AccountRepository,
        private val credentialsRepository: CredentialsRepository,
        private val employerRepository: EmployerRepository,
        private val employeeRepository: EmployeeRepository,
        private val oneTimeHourPreferenceRepository: OneTimeHourPreferenceRepository,
        private val workplaceRepository: WorkplaceRepository,
        private val passwordEncoder: PasswordEncoder,
        private val shiftRepository: ShiftRepository,
        private val utilsService: UtilsService
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
    fun registerWorkplace(registerDetails: RegisterWorkplaceDetailsDto): AccountResponseDto {
        when {
            !registerDetails.isValid() -> return AccountResponseDto(error = FormError.INVALID_FIELDS)
            !EmailValidator.getInstance().isValid(registerDetails.employer.email) -> return AccountResponseDto(error = FormError.INVALID_EMAIL)
            authenticationService.userWithUsernameExists(registerDetails.employer.username) -> return AccountResponseDto(error = FormError.USERNAME_TAKEN)
            authenticationService.userWithEmailExists(registerDetails.employer.email) -> return AccountResponseDto(error = FormError.EMAIL_TAKEN)
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

        return AccountResponseDto(AccountDto(savedCredentials, savedEmployer.account)
        )
    }

    @Transactional
    fun registerEmployee(registerDetails: RegisterEmployeeDetailsDto): AccountResponseDto? {
        findEmployeeByInvitationToken(registerDetails.invitationToken)?.let {
            when {
                !registerDetails.isValid() -> return AccountResponseDto(error = FormError.INVALID_FIELDS)
                !EmailValidator.getInstance().isValid(registerDetails.email) -> return AccountResponseDto(error = FormError.INVALID_EMAIL)
                authenticationService.userWithUsernameExists(registerDetails.username) -> return AccountResponseDto(error = FormError.USERNAME_TAKEN)
                authenticationService.userWithEmailExists(registerDetails.email) -> return AccountResponseDto(error = FormError.EMAIL_TAKEN)
            }
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
                return AccountResponseDto(AccountDto(savedCredentials, savedEmployee.account))
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

    @Transactional
    fun changeAccountDetails(principal: Principal, changeAccountDetails: ChangeAccountDetailsDto): AccountResponseDto? {
        if (!changeAccountDetails.isValid()) return null
        credentialsRepository.findByUsername(principal.name)?.let {
            if (!EmailValidator.getInstance().isValid(changeAccountDetails.newEmail))
                return AccountResponseDto(error = FormError.INVALID_EMAIL)
            if (it.email != changeAccountDetails.newEmail && authenticationService.userWithEmailExists(changeAccountDetails.newEmail))
                return AccountResponseDto(error = FormError.EMAIL_TAKEN)
            else {
                val savedCredentials = credentialsRepository.save(it.copy(email = changeAccountDetails.newEmail))
                val savedAccount = accountRepository.save(it.account.copy(
                        firstName = changeAccountDetails.newFirstName,
                        lastName = changeAccountDetails.newLastName)
                )
                return AccountResponseDto(AccountDto(savedCredentials, savedAccount))
            }
        }
        return null
    }

    @Transactional
    fun changePassword(principal: Principal, changePasswordDetails: ChangePasswordDto): AccountResponseDto? {
        if (!changePasswordDetails.isValid()) return null
        credentialsRepository.findByUsername(principal.name)?.let {
            return if (passwordEncoder.matches(changePasswordDetails.oldPassword, it.password)) {
                credentialsRepository.save(it.copy(password = passwordEncoder.encode(changePasswordDetails.newPassword)))
                AccountResponseDto(getAccount(principal))
            } else {
                AccountResponseDto(error = FormError.INCORRECT_PASSWORD)
            }
        }
        return null
    }

    @Transactional
    fun deleteAccount(principal: Principal): AccountDto? {
        val account = getAccount(principal)
        return when(account.accountType) {
            AccountType.EMPLOYEE -> deleteEmployeeAccount(account)
            AccountType.EMPLOYER -> deleteEmployerAccount(account)
        }
    }

    @Transactional
    fun deleteEmployeeAccount(account: AccountDto): AccountDto? {
        credentialsRepository.findByUsername(account.username!!)?.let {c ->
            employeeRepository.getById(c.account.id)?.let {
                it.employeeStatus = EmployeeStatus.INVITED
                it.invitationToken = utilsService.generateRandomString(Employee.INVITATION_TOKEN_LENGTH)
                oneTimeHourPreferenceRepository.findAllByEmployeeId(it.id).forEach {
                    oneTimeHourPreferenceRepository.delete(it)
                }
                employeeRepository.save(it.copy(oneTimeHourPreferences = mutableListOf(), preferencesWeek = PreferencesWeek()))
                credentialsRepository.delete(c)
                employeeRepository.save(it)
                return account
            }
        }
        return null
    }

    @Transactional
    fun deleteEmployerAccount(account: AccountDto): AccountDto? {
        employerRepository.findByUsername(account.username!!)?.let {
            employeeRepository.findAllByWorkplaceId(it.workplace.id).forEach {
                shiftRepository.getAllByEmployeeId(it.id).forEach {
                    shiftRepository.delete(it)
                }
                credentialsRepository.removeByAccountId(it.account.id)
                employeeRepository.delete(it)
                accountRepository.delete(it.account)
            }
            workplaceRepository.delete(it.workplace)
            credentialsRepository.removeByAccountId(it.account.id)
            employerRepository.delete(it)
            accountRepository.delete(it.account)
            return account
        }
        return null
    }

}