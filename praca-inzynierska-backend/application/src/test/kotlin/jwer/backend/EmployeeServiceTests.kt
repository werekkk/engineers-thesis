package jwer.backend

import jwer.backend.utils.TestUtils.Companion.newTestEmployee
import jwer.backend.utils.TestUtils.Companion.newTestEmployer
import jwer.backend.controller.EmployeeController
import jwer.backend.model.dto.AddEmployeeDto
import jwer.backend.repository.*
import jwer.backend.utils.TestUser
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class EmployeeServiceTests @Autowired constructor(
    private val employeeController: EmployeeController,
    private val credentialsRepository: CredentialsRepository,
    private val employerRepository: EmployerRepository,
    private val employeeRepository: EmployeeRepository,
    private val accountRepository: AccountRepository
) {

    companion object {
    }

    @Test
    fun addEmployee() {
        // given
        val user = TestUser("add_emp")
        val employer = newTestEmployer(user.name, credentialsRepository, employerRepository)
        assert(employeeRepository.findAllByWorkplaceId(employer.workplace.id).isEmpty())
        // when
        val request = AddEmployeeDto("Nowy", "Pracownik")
        employeeController.addEmployee(request, user)
        // then
        assert(employeeRepository.findAllByWorkplaceId(employer.workplace.id).size == 1)
        val savedEmp = employeeRepository.findAllByWorkplaceId(employer.workplace.id)[0]
        assert(savedEmp.account.firstName == "Nowy")
        assert(savedEmp.account.lastName == "Pracownik")
    }

    @Test
    fun getAllEmployees() {
        // given
        val user = TestUser("get_all_emps")
        val employer = newTestEmployer(user.name, credentialsRepository, employerRepository)
        val otherEmployer = newTestEmployer("other", credentialsRepository, employerRepository)
        val e1 = newTestEmployee("Adam", "Abacki", employer.workplace, accountRepository, employeeRepository)
        val e2 = newTestEmployee("Adam", "Wabacki", employer.workplace, accountRepository, employeeRepository)
        val e3 = newTestEmployee("Zdzisław", "Zdzisławski", employer.workplace, accountRepository, employeeRepository)
        val e4 = newTestEmployee("Zdzisław", "Zdzisławski", otherEmployer.workplace, accountRepository, employeeRepository)
        // when
        val result = employeeController.getAllEmployees(user)
        // then
        assert(result.body != null)
        val body = result.body!!
        assert(body.employer.firstName == employer.account.firstName)
        assert(body.employer.lastName == employer.account.lastName)
        assert(body.employees.size == 3)
        listOf(e1, e2, e3).forEach { e ->
            assert(body.employees.any {
                it.employeeId == e.id &&
                it.account.firstName == e.account.firstName &&
                it.account.lastName == e.account.lastName
            })
        }
        assert(!body.employees.any {
            it.employeeId == e4.id &&
            it.account.firstName == e4.account.firstName &&
            it.account.lastName == e4.account.lastName
        })

    }

    @Test
    fun deleteEmployee() {
        // given
        val user = TestUser("delete_emp")
        val employer = newTestEmployer(user.name, credentialsRepository, employerRepository)
        val e1 = newTestEmployee("Adam", "Abacki", employer.workplace, accountRepository, employeeRepository)
        val e2 = newTestEmployee("Adam", "Wabacki", employer.workplace, accountRepository, employeeRepository)
        val e3 = newTestEmployee("Zdzisław", "Zdzisławski", employer.workplace, accountRepository, employeeRepository)
        assert(employeeRepository.findAllByWorkplaceId(employer.workplace.id).size == 3)
        assert(employeeRepository.findAllByWorkplaceId(employer.workplace.id).any { it.id == e2.id})
        // when
        employeeController.deleteEmployee(e2.id, user)
        // then
        assert(employeeRepository.findAllByWorkplaceId(employer.workplace.id).size == 2)
        assert(!employeeRepository.findAllByWorkplaceId(employer.workplace.id).any { it.id == e2.id})
    }


}