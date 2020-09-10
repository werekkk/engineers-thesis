package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.dto.AccountDto
import jwer.pracainzynierskabackend.model.dto.AddEmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeesDto
import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import jwer.pracainzynierskabackend.model.entity.Workplace
import jwer.pracainzynierskabackend.repository.AccountRepository
import jwer.pracainzynierskabackend.repository.CredentialsRepository
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import jwer.pracainzynierskabackend.repository.ShiftRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal

@Service
class EmployeeService @Autowired constructor(
        private val userService: UserService,
        private val utilsService: UtilsService,
        private val workplaceService: WorkplaceService,
        private val employeeRepository: EmployeeRepository,
        private val accountRepository: AccountRepository,
        private val shiftRepository: ShiftRepository,
        private val credentialsRepository: CredentialsRepository
){

    @Transactional
    fun addEmployee(employeeDetails: AddEmployeeDto, principal: Principal): EmployeeDto? {
        val workplace = workplaceService.getWorkplaceByPrincipal(principal)
        workplace?.let {
            return addEmployee(employeeDetails, workplace)
        }
        return null
    }

    private fun addEmployee(ed: AddEmployeeDto, w: Workplace): EmployeeDto {
        val newAccount = accountRepository.save(Account(ed))
        val invitationToken = utilsService.generateRandomString(Employee.INVITATION_TOKEN_LENGTH)
        val newEmployee = Employee(
                newAccount.id,
                newAccount,
                w,
                listOf(),
                invitationToken,
                EmployeeStatus.INVITED
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
    fun deleteEmployee(employeeId: Long, principal: Principal): Long? {
        getEmployeeByIdAndPrincipal(employeeId, principal)?.let {
            shiftRepository.getAllByEmployeeId(it.id).forEach { shiftRepository.delete(it) }
            credentialsRepository.removeByAccountId(it.id)
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

    fun isEmployeeOf(employeeId: Long, employerAccountDto: AccountDto): Boolean {
        return employeeRepository.findByEmployeeIdAndEmployerUsername(employeeId, employerAccountDto.username!!) != null
    }

}