package jwer.backend

import jwer.backend.controller.PositionController
import jwer.backend.model.dto.PositionDto
import jwer.backend.model.dto.SetPositionsDto
import jwer.backend.repository.*
import jwer.backend.utils.TestUser
import jwer.backend.utils.TestUtils
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class PositionServiceTests @Autowired constructor(
    private val positionController: PositionController,
    private val employerRepository: EmployerRepository,
    private val accountRepository: AccountRepository,
    private val credentialsRepository: CredentialsRepository,
    private val positionRepository: PositionRepository,
    private val employeeRepository: EmployeeRepository
){


    @Test
    fun getAllPositions() {
        // given
        val user = TestUser("get_all_positions")
        val emp = TestUtils.newTestEmployer(user.name, credentialsRepository, employerRepository)
        val p1 = TestUtils.newTestPosition("pos1", emp.workplace, positionRepository)
        val p2 = TestUtils.newTestPosition("pos2", emp.workplace, positionRepository)
        val p3 = TestUtils.newTestPosition("pos3", emp.workplace, positionRepository)
        // when
        val result = positionController.getAllPositions(user).body!!
        // then
        assert(result.positions.size == 3)
        listOf(p1, p2, p3).forEach { p ->
            assert(result.positions.any {
                it.name == p.name
            })
        }
    }

    @Test
    fun savePosition() {
        // given
        val user = TestUser("save_position")
        val emp = TestUtils.newTestEmployer(user.name, credentialsRepository, employerRepository)
        val existingPos = TestUtils.newTestPosition("existingPos", emp.workplace, positionRepository)
        // when
        positionController.savePosition(user, PositionDto(existingPos.id, "newName"))
        positionController.savePosition(user, PositionDto(null, "pos1"))
        positionController.savePosition(user, PositionDto(null, "pos2"))
        // then
        assert(positionRepository.getById(existingPos.id)!!.name == "newName")
        val positions = positionRepository.getPositionByEmployerUsername(user.name)
        assert(positions.size == 3)
        listOf("pos1", "pos2").forEach { p ->
            assert(positions.any { it.name == p })
        }
    }

    @Test
    fun deletePosition() {
        // given
        val user = TestUser("delete_position")
        val emp = TestUtils.newTestEmployer(user.name, credentialsRepository, employerRepository)
        val p1 = TestUtils.newTestPosition("p1", emp.workplace, positionRepository)
        val p2 = TestUtils.newTestPosition("p2", emp.workplace, positionRepository)
        val e = TestUtils.newTestEmployeeWithPositions(
            "1", "1", emp.workplace, listOf(p1, p2), accountRepository, employeeRepository)
        // when
        positionController.deletePosition(user, p2.id)
        // then
        val positions = positionRepository.getPositionByEmployerUsername(user.name)
        assert(positions.size == 1)
        assert(positions[0].name == p1.name)
        val employeePositions = employeeRepository.getById(e.id)!!.positions
        assert(employeePositions.size == 1)
        assert((employeePositions[0].name == p1.name))
    }

    @Test
    fun setEmployeePositions() {
        // given
        val user = TestUser("set_employee_position")
        val emp = TestUtils.newTestEmployer(user.name, credentialsRepository, employerRepository)
        val p1 = TestUtils.newTestPosition("p1", emp.workplace, positionRepository)
        val p2 = TestUtils.newTestPosition("p2", emp.workplace, positionRepository)
        val p3 = TestUtils.newTestPosition("p3", emp.workplace, positionRepository)
        val e = TestUtils.newTestEmployeeWithPositions(
            "1", "1", emp.workplace, listOf(p1, p2), accountRepository, employeeRepository)
        // when
        positionController.setEmployeePositions(user, SetPositionsDto(e.id, listOf(p2.id, p3.id)))
        // then
        val employeePositions = employeeRepository.getById(e.id)!!.positions
        assert(employeePositions.size == 2)
        listOf(p2, p3).forEach { ep ->
            employeePositions.any {
                it.id == ep.id && it.name == ep.name
            }
        }
    }
}