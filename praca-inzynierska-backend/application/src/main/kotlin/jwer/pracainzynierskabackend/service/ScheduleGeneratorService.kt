package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.dto.*
import jwer.schedulegenerator.generator.GeneratorConfig
import jwer.schedulegenerator.generator.ScheduleGenerator
import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.Position
import jwer.schedulegenerator.generator.model.Schedule
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Import
import org.springframework.stereotype.Service
import java.security.Principal
import java.time.temporal.ChronoUnit

@Service
@Import(ScheduleGenerator::class)
class ScheduleGeneratorService @Autowired constructor(
        private val scheduleGenerator: ScheduleGenerator,
        private val userService: UserService,
        private val requiredStaffService: RequiredStaffService,
        private val employeeService: EmployeeService,
        private val preferenceService: PreferenceService
){

    companion object {

        const val TIME_STEP_IN_MINUTES = 5
        const val TIME_POINTS_PER_DAY = 24 * 60 / TIME_STEP_IN_MINUTES

    }

    fun generateSchedule(employerPrincipal: Principal, generatorConfigDto: GeneratorConfigDto): ShiftsDto? {
        userService.getAccount(employerPrincipal).let { acc ->
            if (acc.accountType == AccountType.EMPLOYER) {
                createConfig(acc, generatorConfigDto)?.let { c ->
                    return if (c.isValid()) {
                        shiftsFromSchedule(scheduleGenerator.generate(c), generatorConfigDto)
                    } else {
                        ShiftsDto(listOf())
                    }
                }
            }
        }
        return null
    }

    private fun createConfig(employerAccount: AccountDto, configDto: GeneratorConfigDto): GeneratorConfig? {
        val nullablePositions = configDto.positions.map { p -> mapFromPositionDto(employerAccount, p, configDto) }
        val positions = nullablePositions.filterNotNull()
        if (positions.size != nullablePositions.size) return null

        val nullableEmployees = configDto.employees.map { e -> mapFromEmployeeDto(employerAccount, e, positions, configDto) }
        val employees = nullableEmployees.filterNotNull()
        if (employees.size != nullableEmployees.size) return null

        val dayCount = ChronoUnit.DAYS.between(configDto.firstDay, configDto.lastDay) + 1
        return GeneratorConfig(employees, positions, dayCount.toInt(), TIME_POINTS_PER_DAY)
    }

    private fun mapFromPositionDto(acc: AccountDto, position: PositionDto, config: GeneratorConfigDto): Position? {
        if (position.id == null) return null
        requiredStaffService.getRequiredStaffByEmployerAccountAndPositionId(acc, position.id)?.let {
            return Position(position.id, it.toRequiredStaffArray(config.firstDay, config.lastDay))
        }
        return null
    }

    private fun mapFromEmployeeDto(acc: AccountDto, employee: EmployeeDto, positions: List<Position>, config: GeneratorConfigDto): Employee? {
        val employeeId = employee.employeeId
        if (employeeService.isEmployeeOf(employeeId, acc)) {
            val prefWeek = preferenceService.getPreferencesWeekDtoByEmployeeId(employeeId)!!
            val oneTimePrefs = preferenceService.getOneTimeHourPreferencesInPeriod(employeeId, config.firstDay, config.lastDay)!!
            val preferenceWeekArray = prefWeek.toPreferenceArray(config.firstDay, config.lastDay)
            return Employee(
                    employeeId,
                    positions.filter { p -> employee.positions.any { it.id == p.id } },
                    oneTimePrefs.toPreferencesArray(preferenceWeekArray, config.firstDay, config.lastDay)
            )
        }
        return null
    }

    private fun shiftsFromSchedule(schedule: Schedule, configDto: GeneratorConfigDto): ShiftsDto {
        return ShiftsDto.fromGeneratedSchedule(schedule, configDto.firstDay)
    }

}