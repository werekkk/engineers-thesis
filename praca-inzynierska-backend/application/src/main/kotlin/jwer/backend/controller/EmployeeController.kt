package jwer.backend.controller

import jwer.backend.model.dto.AddEmployeeDto
import jwer.backend.model.dto.EmployeeDto
import jwer.backend.model.dto.EmployeesDto
import jwer.backend.service.EmployeeService
import jwer.backend.utils.createResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/employee")
class EmployeeController @Autowired constructor(
        private val employeeService: EmployeeService
){

    @PostMapping("/add")
    fun addEmployee(@RequestBody employeeDetails: AddEmployeeDto, principal: Principal): ResponseEntity<EmployeeDto> {
        return employeeService.addEmployee(employeeDetails, principal).createResponse()
    }

    @GetMapping("/getAll")
    fun getAllEmployees(principal: Principal): ResponseEntity<EmployeesDto> {
        return employeeService.getAllEmployees(principal).createResponse()
    }

    @DeleteMapping("/delete/{id}")
    fun deleteEmployee(@PathVariable id: Long, principal: Principal): ResponseEntity<Long> {
        return employeeService.deleteEmployee(id, principal).createResponse()
    }


}