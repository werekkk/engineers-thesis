package jwer.backend

import jwer.backend.controller.AuthenticationController
import jwer.backend.controller.EmployeeController
import jwer.backend.controller.PositionController
import jwer.backend.controller.UserController
import jwer.backend.model.dto.*
import jwer.backend.repository.CredentialsRepository
import jwer.backend.repository.EmployerRepository
import jwer.backend.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.security.Principal

@Component
class SampleData @Autowired constructor(
        private val userController: UserController,
        private val authenticationController: AuthenticationController,
        private val positionController: PositionController,
        private val employeeController: EmployeeController,
        private val userService: UserService,
        private val credentialsRepository: CredentialsRepository,
        private val employerRepository: EmployerRepository
){

    lateinit var principal: Principal

    companion object {
        private val SAMPLE_WORKPLACE = RegisterWorkplaceDetailsDto(
                RegisterAccountDetailsDto(
                        "test",
                        "test",
                        "jan.kowalski@test.com",
                        "Jan",
                        "Kowalski"
                ),
                "Przykładowy zakład pracy"
        )
        private val SAMPLE_WORKPLACE_POSITIONS = PositionsDto(listOf(
                PositionDto(null, "Kelner"),
                PositionDto(null, "Kucharz"),
                PositionDto(null, "Dostawca"),
                PositionDto(null, "Osoba sprzątająca")
        ))
        private val SAMPLE_EMPLOYEES = listOf(
                AddEmployeeDto("Filip", "Sikorski"),
                AddEmployeeDto("Marcin", "Szczepański"),
                AddEmployeeDto("Bolesław", "Kucharski"),
                AddEmployeeDto("Jerzy", "Zawadzki"),
                AddEmployeeDto("Kamila", "Urbańska"),
                AddEmployeeDto("Łucja", "Krajewska"),
                AddEmployeeDto("Aleksandra", "Kalinowska"),
                AddEmployeeDto("Gabriela", "Andrzejewska"),
                AddEmployeeDto("Diana", "Górecka")
        )
    }

    fun initSampleData() {
        println("Sample data initialization started...")
        initSampleWorkplace()
        login()
        initSampleWorkplacePositions()
        initSampleEmployees()
        logout()
        println("Sample data initialization finished.")
    }

    private fun initSampleWorkplace() {
        if (!sampleWorkplaceExists()) {
            userController.registerWorkplace(SAMPLE_WORKPLACE)
        }
    }

    private fun sampleWorkplaceExists(): Boolean {
        return credentialsRepository.findByUsername(SAMPLE_WORKPLACE.employer.username) != null
    }

    private fun login() {
        SecurityContextHolder.getContext().authentication = UsernamePasswordAuthenticationToken("test", "test")
        principal = SecurityContextHolder.getContext().authentication
    }

    private fun initSampleWorkplacePositions() {
        val existingPositions = positionController.getAllPositions(principal).body!!.positions
        SAMPLE_WORKPLACE_POSITIONS.positions.forEach {
            if (!existingPositions.any { p -> p.name == it.name }) {
                positionController.savePosition(principal, it)
            }
        }
    }

    private fun initSampleEmployees() {
        val existingEmployees = employeeController.getAllEmployees(principal).body!!.employees
        SAMPLE_EMPLOYEES.forEach {
            if (!existingEmployees.any { e -> e.account.firstName == it.firstName && e.account.lastName == it.lastName }) {
                employeeController.addEmployee(it, principal)
            }
        }
    }

    private fun logout() {
        authenticationController.logout()
    }

}