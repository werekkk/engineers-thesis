package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.dto.AddEmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeesDto
import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import jwer.pracainzynierskabackend.model.entity.Workplace
import jwer.pracainzynierskabackend.repository.AccountRepository
import jwer.pracainzynierskabackend.repository.CredentialsRepository
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal
import java.time.LocalDate

@Service
class EmployeeService @Autowired constructor(
        private val userService: UserService,
        private val utilsService: UtilsService,
        private val workplaceService: WorkplaceService,
        private val employeeRepository: EmployeeRepository,
        private val accountRepository: AccountRepository,
        private val credentialsRepository: CredentialsRepository
){

    @Transactional
    fun addEmployee(employeeDetails: AddEmployeeDto, principal: Principal): EmployeeDto? {
        val workplace = workplaceService.getWorkplaceByPrincipal(principal)
        workplace?.let {
            return when(employeeDetails.employeeStatus) {
                EmployeeStatus.WITHOUT_ACCOUNT -> addEmployee(employeeDetails, workplace, false)
                EmployeeStatus.INVITED -> addEmployee(employeeDetails, workplace, true)
                else -> null
            }
        }
        return null
    }

    private fun addEmployee(ed: AddEmployeeDto, w: Workplace, withAccount: Boolean): EmployeeDto {
        val newAccount = accountRepository.save(Account(ed))
        val invitationToken = utilsService.generateRandomString(Employee.INVITATION_TOKEN_LENGTH)
        val newEmployee = Employee(
                newAccount.id,
                newAccount,
                ed.employmentDate,
                null,
                w,
                listOf(),
                if (withAccount) invitationToken else null,
                if (withAccount) EmployeeStatus.INVITED else EmployeeStatus.WITHOUT_ACCOUNT
        )
        return EmployeeDto(employeeRepository.save(newEmployee))
    }

    fun getAllEmployees(employerPrincipal: Principal): EmployeesDto? {
        val workplace = workplaceService.getWorkplaceByEmployer(employerPrincipal)
        val employer = userService.getAccount(employerPrincipal)
        workplace?.let {
            val employees = employeeRepository.findAllByWorkplaceId(it.id)
                    .map { e -> EmployeeDto(e) }
            return EmployeesDto(employees, employer)
        }
        return null
    }

    @Transactional
    fun dischargeEmployee(employeeId: Long, principal: Principal): EmployeeDto? {
        getEmployeeByIdAndPrincipal(employeeId, principal)?.let {
            it.employeeStatus = EmployeeStatus.DISCHARGED
            it.dischargeDate = LocalDate.now()
            credentialsRepository.removeByAccountId(it.account.id)
            return EmployeeDto(employeeRepository.save(it))
        }
        return null
    }

    @Transactional
    fun deleteEmployee(employeeId: Long, principal: Principal): Long? {
        getEmployeeByIdAndPrincipal(employeeId, principal)?.let {
            employeeRepository.delete(it)
            return it.id
        }
        return null
    }

    private fun getEmployeeByIdAndPrincipal(employeeId: Long, principal: Principal): Employee? {
        val workplace = workplaceService.getWorkplaceByPrincipal(principal)
        workplace?.let {
            return employeeRepository.findByAccountIdAndWorkplaceId(employeeId, workplace.id)
        }
        return null
    }

    fun getById(employeeId: Long): Employee? {
        return employeeRepository.getById(employeeId)
    }

    fun getByEmployeePrincipal(employeePrincipal: Principal): Employee? {
        userService.getAccount(employeePrincipal).let {
            return employeeRepository.findByUsername(it.username!!)
        }
    }

}