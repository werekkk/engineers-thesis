package jwer.backend.service

import jwer.backend.model.dto.EmployeeDto
import jwer.backend.model.dto.PositionDto
import jwer.backend.model.dto.PositionsDto
import jwer.backend.model.dto.SetPositionsDto
import jwer.backend.model.entity.Position
import jwer.backend.repository.EmployeeRepository
import jwer.backend.repository.PositionRepository
import jwer.backend.repository.ShiftRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal

@Service
class PositionService @Autowired constructor(
        private val userService: UserService,
        private val workplaceService: WorkplaceService,
        private val shiftRepository: ShiftRepository,
        private val positionRepository: PositionRepository,
        private val employeeRepository: EmployeeRepository
) {

    fun getPositionsDtoByEmployer(principal: Principal): PositionsDto? {
        return getPositionsByEmployer(principal)
                .map { p -> PositionDto(p) }
                .let {
                    PositionsDto(it)
                }
    }

    fun getPositionsByEmployer(principal: Principal): List<Position> {
        userService.getAccount(principal).let {
            return positionRepository.getPositionByEmployerUsername(it.username!!)
        }
    }

    fun savePosition(principal: Principal, position: PositionDto): PositionDto? {
        workplaceService.getWorkplaceByEmployer(principal)?.let {
            if (position.validate()) {
                if (position.id != null && position.id != 0L) {
                    if (getPositionsByEmployer(principal).any {it.id == position.id}) {
                        positionRepository.getById(position.id)?.let {
                            val updatedPosition = it.copy(name = position.name)
                            val savedPosition = positionRepository.save(updatedPosition)
                            return PositionDto(savedPosition)
                        }
                    }
                } else {
                    val newPosition = Position(position.id?:0, position.name, it)
                    val savedPosition = positionRepository.save(newPosition)
                    return PositionDto(savedPosition)
                }
            }
        }
        return null
    }

    @Transactional
    fun deletePosition(principal: Principal, positionId: Long): PositionDto? {
        getPositionsByEmployer(principal).find { p -> p.id == positionId }?.let {
            positionRepository.getEmployeesByPosition(it.id).forEach { emp ->
                val updatedEmp = emp.copy(positions = emp.positions.filter { p -> p.id != it.id })
                employeeRepository.save(updatedEmp)
            }
            positionRepository.delete(it)
            shiftRepository.getAllByPositionId(it.id).forEach { shiftRepository.delete(it) }
            return PositionDto(it)
        }
        return null
    }

    @Transactional
    fun setEmployeePositions(principal: Principal, positionDetails: SetPositionsDto): EmployeeDto? {
        workplaceService.getWorkplaceByEmployer(principal)?.let { w ->
            employeeRepository.findByAccountIdAndWorkplaceId(positionDetails.employeeId, w.id)?.let {
                val newPositions = positionDetails.positionIds.mapNotNull { posId ->
                    positionRepository.getById(posId)
                }
                findLostPositions(it.positions, newPositions).forEach {p ->
                    shiftRepository.getAllByPositionIdAndEmployeeId(p.id, it.id).forEach {
                        shiftRepository.delete(it)
                    }
                }
                val savedEmployee = employeeRepository.save(it.copy(positions = newPositions))
                return EmployeeDto(savedEmployee)
            }
        }
        return null
    }

    private fun findLostPositions(oldPositions: List<Position>, newPositions: List<Position>): List<Position> {
        return oldPositions.filter { op -> !newPositions.any { it.id == op.id } }
    }

    fun getEmployeePositions(employeePrincipal: Principal): PositionsDto? {
        userService.getAccount(employeePrincipal).let {
            val positions = positionRepository.getEmployeePositionsByUsername(it.username!!)
            return PositionsDto(positions.map { p -> PositionDto(p) })
        }
    }

    fun getById(positionId: Long): Position? {
        return positionRepository.getById(positionId)
    }
}