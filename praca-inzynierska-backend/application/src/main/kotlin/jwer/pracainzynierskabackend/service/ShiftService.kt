package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.SavedShiftResponseDto
import jwer.pracainzynierskabackend.model.dto.ShiftDto
import jwer.pracainzynierskabackend.model.dto.ShiftsDto
import jwer.pracainzynierskabackend.model.embeddable.DateTimePeriod
import jwer.pracainzynierskabackend.model.entity.Shift
import jwer.pracainzynierskabackend.model.entity.ShiftType
import jwer.pracainzynierskabackend.repository.ShiftRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Principal
import java.time.LocalDate
import java.time.LocalDateTime

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
    fun saveShift(principal: Principal, shift: ShiftDto): SavedShiftResponseDto? {
        if (canPersistShift(principal, shift) && shift.start.isBefore(shift.finish)) {
            val shiftsToBeDeleted = getOverlappingShifts(shift)
            shiftsToBeDeleted.forEach { s -> run{
                if (s.period.start.isBefore(shift.start)) shift.start = s.period.start
                if (s.period.finish.isAfter(shift.finish)) shift.finish = s.period.finish
                shiftRepository.delete(s)
            } }
            val savedShift = shiftRepository.save(createShiftFromDto(shift, ShiftType.MANUALLY_ASSIGNED))
            return SavedShiftResponseDto(ShiftDto(savedShift), shiftsToBeDeleted.map { s -> s.id })
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