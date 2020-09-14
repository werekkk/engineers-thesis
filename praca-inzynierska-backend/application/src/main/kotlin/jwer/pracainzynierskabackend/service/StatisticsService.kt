package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.*
import jwer.pracainzynierskabackend.repository.ShiftRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal
import java.time.LocalDateTime

@Service
class StatisticsService @Autowired constructor(
        private val workplaceService: WorkplaceService,
        private val employeeService: EmployeeService,
        private val positionService: PositionService,
        private val shiftRepository: ShiftRepository
) {

    fun getYearStatistics(employerPrincipal: Principal, year: Int): StatisticsYearDto? {
        workplaceService.getWorkplaceByEmployer(employerPrincipal)?.let { w ->
            val start = LocalDateTime.of(year, 1, 1, 0, 0, 0, 0)
            val finish = LocalDateTime.of(year+1, 1, 1, 0, 0, 0, 0)
            val shifts = shiftRepository.getAllByWorkplaceIdAndPeriod(w.id, start, finish)

            val positions = positionService.getPositionsByEmployer(employerPrincipal)
            val employees = employeeService.getAllEmployees(employerPrincipal)!!

            val statistics = StatisticsYearDto(
                    year,
                    positions.map { p ->
                        StatisticsPositionYearDto(
                            PositionDto(p),
                            employees.employees.filter { it.positions.any { it.id == p.id } }.map { StatisticsEmployeeYearDto(it) })
                        },
                        employees.employees.map { StatisticsEmployeeYearDto(it)
                    }
            )

            shifts.forEach {
                statistics.positionStatistics.find { p -> p.position.id == it.position.id }?.let { p -> p.add(it) }
                statistics.employeeStatistics.find { e -> e.employee.employeeId == it.employee.id}?.let { e -> e.add(it) }
            }

            return statistics
        }
        return null
    }

}