package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.AddEmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeeDto
import jwer.pracainzynierskabackend.model.dto.EmployeesDto
import jwer.pracainzynierskabackend.service.EmployeeService
import jwer.pracainzynierskabackend.utils.ControllerUtils
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
        return ControllerUtils.createResponse(employeeService.addEmployee(employeeDetails, principal))
    }

    @GetMapping("/getAll")
    fun getAllEmployees(principal: Principal): ResponseEntity<EmployeesDto> {
        return ControllerUtils.createResponse(employeeService.getAllEmployees(principal))
    }

    @PostMapping("/discharge/{id}")
    fun dischargeEmployee(@PathVariable id: Long, principal: Principal): ResponseEntity<EmployeeDto> {
        return ControllerUtils.createResponse(employeeService.dischargeEmployee(id, principal))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteEmployee(@PathVariable id: Long, principal: Principal): ResponseEntity<Long> {
        return ControllerUtils.createResponse(employeeService.deleteEmployee(id, principal))
    }


}