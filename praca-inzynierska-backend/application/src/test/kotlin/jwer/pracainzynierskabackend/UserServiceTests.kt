package jwer.pracainzynierskabackend

import jwer.pracainzynierskabackend.controller.EmployeeController
import jwer.pracainzynierskabackend.controller.PositionController
import jwer.pracainzynierskabackend.controller.ShiftController
import jwer.pracainzynierskabackend.controller.UserController
import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import jwer.pracainzynierskabackend.model.entity.Position
import jwer.pracainzynierskabackend.repository.*
import jwer.pracainzynierskabackend.service.WorkplaceService
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.security.Principal
import java.time.LocalDateTime
import javax.sql.DataSource

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class UserServiceTests @Autowired constructor(
        private val dataSource: DataSource,
        private val credentialsRepository: CredentialsRepository,
        private val employerRepository: EmployerRepository,
        private val accountRepository: AccountRepository,
        private val workplaceRepository: WorkplaceRepository,
        private val positionRepository: PositionRepository,
        private val shiftRepository: ShiftRepository,
        private val employeeRepository: EmployeeRepository,
        private val workplaceService: WorkplaceService,
        private val userController: UserController,
        private val positionController: PositionController,
        private val employeeController: EmployeeController,
        private val shiftController: ShiftController
) {

    companion object {

        val EMPLOYER_LOGIN = "tests"
        val POSITION_1_NAME = "Position 1"
        val POSITION_2_NAME = "Position 2"

        class TestUser : Principal {
            override fun getName(): String = EMPLOYER_LOGIN
        }

    }

    @Test()
    @Order(1)
    fun checkDatabaseDriver() {
        assert(dataSource.connection.metaData.driverName == "H2 JDBC Driver")
    }

    @Test()
    @Order(2)
    fun deleteEmptyWorkplace() {
        val user = registerTestWorkplace()

        val workplace = workplaceService.getWorkplaceByEmployer(user)!!
        val accountId = workplace.employer!!.account.id
        val workplaceId = workplace.id
        val employerCredentialsId = credentialsRepository.findByUsername(user.name)!!.id

        assert(workplaceRepository.existsById(workplaceId))
        assert(employerRepository.existsById(accountId))
        assert(accountRepository.existsById(accountId))
        assert(credentialsRepository.existsById(employerCredentialsId))

        userController.deleteAccount(user)

        assert(!workplaceRepository.existsById(workplaceId))
        assert(!employerRepository.existsById(accountId))
        assert(!accountRepository.existsById(accountId))
        assert(!credentialsRepository.existsById(employerCredentialsId))
    }

    @Test()
    @Order(3)
    fun deleteWorkplaceWithPositions() {
        val user = registerTestWorkplace()
        val savedPositions = addTwoPositions(user)

        assert(savedPositions.size == 2)
        assert(savedPositions.any { it.name == POSITION_1_NAME })
        assert(savedPositions.any { it.name == POSITION_2_NAME })
        savedPositions.forEach { assert(positionRepository.existsById(it.id)) }

        userController.deleteAccount(user)

        savedPositions.forEach { assert(!positionRepository.existsById(it.id)) }
    }

    @Test
    @Order(4)
    fun deleteWorkplaceWithEmployeesAndPositions() {
        val user = registerTestWorkplace()
        val savedPositions = addTwoPositions(user)
        var savedEmployees = addTwoEmployees(user)
        userController.registerEmployee(RegisterEmployeeDetailsDto("emp","test","emp@test.com", savedEmployees[1].invitationToken!!))
        val savedEmployeeCredentialsId = credentialsRepository.findByUsername("emp")!!.id

        positionController.setEmployeePositions(user, SetPositionsDto(savedEmployees[0].id, listOf(savedPositions[0].id, savedPositions[1].id)))
        positionController.setEmployeePositions(user, SetPositionsDto(savedEmployees[1].id, listOf(savedPositions[0].id)))

        savedEmployees = savedEmployees.map { employeeRepository.findById(it.id).get() }
        assert(savedEmployees.size == 2)
        assert(savedEmployees[0].positions.size == 2)
        assert(savedEmployees[1].positions.size == 1)
        assert(savedEmployees[0].positions.any { it.id == savedPositions[0].id })
        assert(savedEmployees[0].positions.any { it.id == savedPositions[1].id })
        assert(savedEmployees[1].positions.any { it.id == savedPositions[0].id })
        assert(credentialsRepository.existsById(savedEmployeeCredentialsId))

        userController.deleteAccount(user)

        savedPositions.forEach { assert(!positionRepository.existsById(it.id)) }
        savedEmployees.forEach { assert(!employeeRepository.existsById(it.id)) }
        savedEmployees.forEach { assert(!accountRepository.existsById(it.id)) }
        assert(!credentialsRepository.existsById(savedEmployeeCredentialsId))
    }

    @Test
    @Order(5)
    fun deleteEmployerAccount() {
        val user = registerTestWorkplace()

        val empUser = object : Principal { override fun getName(): String = "emp" }
        val emp = employeeController.addEmployee(AddEmployeeDto("fn1", "ln1"), user).body!!
        userController.registerEmployee(RegisterEmployeeDetailsDto("emp","test","emp@test.com", emp.invitationToken!!))
        val savedEmployeeCredentials = credentialsRepository.findByUsername("emp")!!

        val empCredentialsId = savedEmployeeCredentials.id
        val empAccountId = savedEmployeeCredentials.account.id

        assert(credentialsRepository.existsById(empCredentialsId))
        assert(accountRepository.existsById(empAccountId))
        assert(employeeRepository.existsById(empAccountId))
        assert(employeeRepository.getById(empAccountId)!!.invitationToken == null)
        assert(employeeRepository.getById(empAccountId)!!.employeeStatus == EmployeeStatus.HAS_ACCOUNT)

        userController.deleteAccount(empUser)

        assert(!credentialsRepository.existsById(empCredentialsId))
        assert(accountRepository.existsById(empAccountId))
        assert(employeeRepository.existsById(empAccountId))
        assert(employeeRepository.getById(empAccountId)!!.invitationToken != null)
        assert(employeeRepository.getById(empAccountId)!!.employeeStatus == EmployeeStatus.INVITED)
    }

    @Test
    @Order(6)
    fun deleteWorkplaceWithShifts() {
        val user = registerTestWorkplace()
        val savedPositions = addTwoPositions(user)
        var savedEmployees = addTwoEmployees(user)
        userController.registerEmployee(RegisterEmployeeDetailsDto("emp","test","emp@test.com", savedEmployees[1].invitationToken!!))

        positionController.setEmployeePositions(user, SetPositionsDto(savedEmployees[0].id, listOf(savedPositions[0].id, savedPositions[1].id)))
        positionController.setEmployeePositions(user, SetPositionsDto(savedEmployees[1].id, listOf(savedPositions[0].id)))

        val start = LocalDateTime.now()
        val finish = start.plusHours(1)
        val shifts = listOf(
                shiftController.saveShift(user, ShiftDto(0, savedEmployees[0].id, savedPositions[0].id, start, finish, null, null)).body!!,
                shiftController.saveShift(user, ShiftDto(0, savedEmployees[0].id, savedPositions[1].id, start.plusHours(2), finish.plusHours(3), null, null)).body!!,
                shiftController.saveShift(user, ShiftDto(0, savedEmployees[1].id, savedPositions[0].id, start, finish, null, null)).body!!
        )

        shifts.forEach { assert(shiftRepository.existsById(it.savedShift.id)) }
        userController.deleteAccount(user)
        shifts.forEach { assert(!shiftRepository.existsById(it.savedShift.id)) }

    }

    private fun registerTestWorkplace(): Principal {
        val user = object : Principal { override fun getName(): String = EMPLOYER_LOGIN }
        userController.registerWorkplace(RegisterWorkplaceDetailsDto(
                RegisterAccountDetailsDto(
                        EMPLOYER_LOGIN, EMPLOYER_LOGIN, "test@test.com", "Jan", "Kowalski"
                ),
                "Workplace name"
        )).body
        return user
    }

    private fun addTwoPositions(employerPrincipal: Principal): List<Position> {
        positionController.savePosition(employerPrincipal, PositionDto(null, POSITION_1_NAME))
        positionController.savePosition(employerPrincipal, PositionDto(null, POSITION_2_NAME))
        val savedPositions = positionController.getAllPositions(employerPrincipal).body!!.positions
        return savedPositions.map { positionRepository.getById(it.id!!)!! }
    }

    private fun addTwoEmployees(employerPrincipal: Principal): List<Employee> {
        employeeController.addEmployee(AddEmployeeDto("fn1", "ln1"), employerPrincipal)
        employeeController.addEmployee(AddEmployeeDto("fn2", "ln2"), employerPrincipal)
        return employeeController.getAllEmployees(employerPrincipal).body!!.employees.map { employeeRepository.getById(it.employeeId)!! }
    }
}