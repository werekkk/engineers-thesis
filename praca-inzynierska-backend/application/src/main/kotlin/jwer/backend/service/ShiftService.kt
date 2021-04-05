package jwer.backend.service

import jwer.backend.model.dto.SavedShiftResponseDto
import jwer.backend.model.dto.ShiftDto
import jwer.backend.model.dto.ShiftsDto
import jwer.backend.model.dto.ShiftsWithGeneratorConfigDto
import jwer.backend.model.embeddable.DateTimePeriod
import jwer.backend.model.entity.Shift
import jwer.backend.model.entity.ShiftType
import jwer.backend.model.entity.Workplace
import jwer.backend.repository.ShiftRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class ShiftService @Autowired constructor(
        private val positionService: PositionService,
        private val employeeService: EmployeeService,
        private val workplaceService: WorkplaceService,
        private val shiftRepository: ShiftRepository
){

    fun getShiftsByPosition(principal: Principal, positionId: Long, startingDay: LocalDate, days: Int): ShiftsDto? {
        return if (positionService.getPositionsByEmployer(principal).any { p -> p.id == positionId}){
            val shifts = getShiftsByPositionAndPeriod(positionId, startingDay, days)
            ShiftsDto(shifts.map { s -> ShiftDto(s) })
        } else {
            null
        }
    }

    private fun getShiftsByPositionAndPeriod(positionId: Long, startingDay: LocalDate, days: Int): List<Shift> {
        return shiftRepository.getShiftsByPositionAndPeriod(
                positionId,
                startingDay.atStartOfDay(),
                startingDay.plusDays(days.toLong()).atStartOfDay()
        )
    }

    fun getEmployeeShifts(employeePrincipal: Principal, startingDay: LocalDate, days: Int = 7): ShiftsDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let {
            val shifts = shiftRepository.getShiftsByEmployeeAndPeriod(
                    it.id,
                    startingDay.atStartOfDay(),
                    startingDay.plusDays(days.toLong()).atStartOfDay()
            )
            return ShiftsDto(shifts.map { s -> ShiftDto(s) })
        }
        return null
    }

    @Transactional
    fun saveGeneratedShifts(principal: Principal, shifts: ShiftsWithGeneratorConfigDto): ShiftsDto? {
        workplaceService.getWorkplaceByEmployer(principal)?.let { w ->
            shifts.generatorConfig.employees.forEach {
                deleteShiftsByPeriodAndEmployee(w, it.employeeId, shifts.generatorConfig.firstDay, shifts.generatorConfig.lastDay)
            }
            shifts.shifts.shifts.forEach {
                saveShift(principal, it.copy(creationDate = LocalDateTime.now()), it.shiftType ?: ShiftType.GENERATED)
            }
            return shifts.shifts
        }
        return null
    }

    @Transactional
    fun deleteShiftsByPeriodAndEmployee(workplace: Workplace, employeeId: Long, firstDay: LocalDate, lastDay: LocalDate) {
        if (workplace.employees.any { it.id == employeeId }) {
            shiftRepository
                    .getShiftsByEmployeeAndPeriod(employeeId, firstDay.atStartOfDay(), lastDay.plusDays(1).atStartOfDay())
                    .forEach {
                        shiftRepository.delete(it)
                    }
        }
    }

    @Transactional
    fun deleteShiftsByPeriodAndPosition(workplace: Workplace, positionId: Long, firstDay: LocalDate, lastDay: LocalDate) {
        if (workplace.positions.any { it.id == positionId }) {
            shiftRepository
                    .getShiftsByPositionAndPeriod(positionId, firstDay.atStartOfDay(), lastDay.atTime(LocalTime.MIDNIGHT))
                    .forEach { shiftRepository.delete(it) }
        }
    }

    @Transactional
    fun saveShift(principal: Principal, shift: ShiftDto, type: ShiftType = ShiftType.MANUALLY_ASSIGNED): SavedShiftResponseDto? {
        if (canPersistShift(principal, shift) && shift.start.isBefore(shift.finish)) {
            val shiftsToBeDeleted = getOverlappingShifts(shift).filter { !(it.position.id != shift.positionId && shift.boundOverlap(ShiftDto(it))) }
            if (shiftsToBeDeleted.any {it.position.id != shift.positionId}) {
                return null
            }
            shiftsToBeDeleted.forEach {
                if (it.period.start.isBefore(shift.start)) shift.start = it.period.start
                if (it.period.finish.isAfter(shift.finish)) shift.finish = it.period.finish
                shiftRepository.delete(it)
            }
            val savedShift = shiftRepository.save(createShiftFromDto(shift, type))
            return SavedShiftResponseDto(ShiftDto(savedShift), shiftsToBeDeleted.map { it.id })
        }
        return null
    }

    @Transactional
    fun deleteShift(principal: Principal, shiftId: Long): ShiftDto? {
        shiftRepository.getById(shiftId)?.let {
            if (canPersistShift(principal, ShiftDto(it))) {
                shiftRepository.deleteById(shiftId)
                return ShiftDto(it)
            }
        }
        return null
    }

    private fun canPersistShift(employerPrincipal: Principal, shift: ShiftDto): Boolean {
        workplaceService.getWorkplaceByEmployer(employerPrincipal)?.let {
            return it.employees.any { e -> e.id == shift.employeeId }
                    && it.positions.any { p -> p.id == shift.positionId }
        }
        return false
    }

    private fun getOverlappingShifts(shift: ShiftDto): List<Shift> {
        return shiftRepository.getOverlappingShifts(shift.employeeId, shift.start, shift.finish)
    }

    private fun createShiftFromDto(shift: ShiftDto, defaultShiftType: ShiftType): Shift {
        val emp = employeeService.getById(shift.employeeId)!!
        val pos = positionService.getById(shift.positionId)!!
        return Shift(
                shift.id,
                emp,
                pos,
                shift.creationDate ?: LocalDateTime.now(),
                DateTimePeriod(
                        shift.start,
                        shift.finish
                ),
                shift.shiftType ?: defaultShiftType
        )
    }
}