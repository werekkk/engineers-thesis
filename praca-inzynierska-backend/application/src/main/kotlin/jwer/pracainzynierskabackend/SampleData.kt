package jwer.pracainzynierskabackend

import jwer.pracainzynierskabackend.controller.AuthenticationController
import jwer.pracainzynierskabackend.controller.EmployeeController
import jwer.pracainzynierskabackend.controller.PositionController
import jwer.pracainzynierskabackend.controller.UserController
import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import jwer.pracainzynierskabackend.repository.CredentialsRepository
import jwer.pracainzynierskabackend.repository.EmployerRepository
import jwer.pracainzynierskabackend.service.UserService
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
                        "Bonifacy",
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
                AddEmployeeDto("Filip", null, "Sikorski"),
                AddEmployeeDto("Marcin", "Gustaw", "Szczepański"),
                AddEmployeeDto("Bolesław", null, "Kucharski"),
                AddEmployeeDto("Jerzy", "Andrzej", "Zawadzki"),
                AddEmployeeDto("Kamila", null, "Urbańska"),
                AddEmployeeDto("Łucja", "Antonina", "Krajewska"),
                AddEmployeeDto("Aleksandra", null, "Kalinowska"),
                AddEmployeeDto("Gabriela", "Honorata", "Andrzejewska"),
                AddEmployeeDto("Diana", null, "Górecka")
        )
    }

    fun initSampleData() {
        println("Sample data initialization started...")
        initSampleWorkplace()
        login()
        initSampleWorkplacePositions()
        initSampleWorkers()
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

    private fun initSampleWorkers() {
        val existingEmployees = employeeController.getAllEmployees(principal).body!!.employees
        SAMPLE_EMPLOYEES.forEach {
            if (!existingEmployees.any { e -> e.account.firstName == it.firstName && e.account.middleName == it.middleName && e.account.lastName == it.lastName }) {
                employeeController.addEmployee(it, principal)
            }
        }
    }

    private fun logout() {
        authenticationController.logout()
    }

}