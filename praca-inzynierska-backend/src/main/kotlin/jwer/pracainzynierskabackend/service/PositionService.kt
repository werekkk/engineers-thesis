package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.EmployeeDto
import jwer.pracainzynierskabackend.model.dto.PositionDto
import jwer.pracainzynierskabackend.model.dto.PositionsDto
import jwer.pracainzynierskabackend.model.dto.SetPositionsDto
import jwer.pracainzynierskabackend.model.entity.Position
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import jwer.pracainzynierskabackend.repository.PositionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal

@Service
class PositionService @Autowired constructor(
        private val userService: UserService,
        private val workplaceService: WorkplaceService,
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
            val position = Position(position.id?:0, position.name, "", it)
            val savedPosition = positionRepository.save(position)
            return PositionDto(savedPosition)
        }
        return null
    }

    fun deletePosition(principal: Principal, positionId: Long): PositionDto? {
        getPositionsByEmployer(principal).find { p -> p.id == positionId }?.let {
                positionRepository.delete(it)
                return PositionDto(it)
        }
        return null
    }

    fun setEmployeePositions(principal: Principal, positionDetails: SetPositionsDto): EmployeeDto? {
        workplaceService.getWorkplaceByEmployer(principal)?.let { w ->
            employeeRepository.findByAccountIdAndWorkplaceId(positionDetails.employeeId, w.id)?.let {
                val newPositions = positionDetails.positionIds.mapNotNull { posId ->
                    positionRepository.getById(posId)
                }
                val savedEmployee = employeeRepository.save(it.copy(positions = newPositions))
                return EmployeeDto(savedEmployee)
            }
        }
        return null
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