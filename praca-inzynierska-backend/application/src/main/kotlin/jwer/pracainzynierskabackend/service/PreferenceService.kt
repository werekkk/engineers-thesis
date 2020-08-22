package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.OneTimeHourPreferenceDto
import jwer.pracainzynierskabackend.model.dto.OneTimeHourPreferencesDto
import jwer.pracainzynierskabackend.model.dto.PreferencesWeekDto
import jwer.pracainzynierskabackend.model.entity.OneTimeHourPreference
import jwer.pracainzynierskabackend.model.entity.PreferencesWeek
import jwer.pracainzynierskabackend.repository.OneTimeHourPreferenceRepository
import jwer.pracainzynierskabackend.repository.PreferencesWeekRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal
import java.time.LocalDate
import java.time.LocalTime
import javax.transaction.Transactional

@Service
class PreferenceService @Autowired constructor(
        private val employeeService: EmployeeService,
        private val preferencesWeekRepository: PreferencesWeekRepository,
        private val oneTimeHourPreferenceRepository: OneTimeHourPreferenceRepository
){

    fun getPreferencesByEmployeePrincipal(employeePrincipal: Principal): PreferencesWeekDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let { e ->
            return getPreferencesWeekDtoByEmployeeId(e.id)
        }
        return null
    }

    fun savePreferencesByEmployeePrincipal(employeePrincipal: Principal, preferences: PreferencesWeekDto): PreferencesWeekDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let { e ->
            getPreferencesByEmployeeId(e.id)?.let {
                val updatedPreferences = it.copy(
                        mondayPreferences = it.mondayPreferences.update(preferences.mondayPreferences),
                        tuesdayPreferences = it.tuesdayPreferences.update(preferences.tuesdayPreferences),
                        wednesdayPreferences = it.wednesdayPreferences.update(preferences.wednesdayPreferences),
                        thursdayPreferences = it.thursdayPreferences.update(preferences.thursdayPreferences),
                        fridayPreferences = it.fridayPreferences.update(preferences.fridayPreferences),
                        saturdayPreferences = it.saturdayPreferences.update(preferences.saturdayPreferences),
                        sundayPreferences = it.sundayPreferences.update(preferences.sundayPreferences)
                )
                return PreferencesWeekDto(preferencesWeekRepository.save(updatedPreferences))
            }
        }
        return null
    }

    fun getPreferencesWeekDtoByEmployeeId(employeeId: Long): PreferencesWeekDto? {
        getPreferencesByEmployeeId(employeeId)?.let { return PreferencesWeekDto(it) }
        return null
    }

    private fun getPreferencesByEmployeeId(employeeId: Long): PreferencesWeek? {
        return preferencesWeekRepository.findByEmployeeId(employeeId)
    }

    /**
     * @param start (inclusive)
     * @param finish (inclusive)
     */
    fun getOneTimeHourPreferencesInPeriod(employeePrincipal: Principal, start: LocalDate, finish: LocalDate): OneTimeHourPreferencesDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let {
            return getOneTimeHourPreferencesInPeriod(it.id, start, finish)
        }
        return null
    }

    /**
     * @param start (inclusive)
     * @param finish (inclusive)
     */
    fun getOneTimeHourPreferencesInPeriod(employeeId: Long, start: LocalDate, finish: LocalDate): OneTimeHourPreferencesDto? {
        val prefs = getOneTimeHourPreferencesByEmployeeAndPeriod(employeeId, start, finish)
        return OneTimeHourPreferencesDto(prefs.map { p -> OneTimeHourPreferenceDto(p) })
    }

    @Transactional
    fun setOneTimeHourPreferencesForDay(employeePrincipal: Principal, newPref: OneTimeHourPreferencesDto, day: LocalDate): OneTimeHourPreferencesDto? {
        if (newPref.areInDay(day)) {
            newPref.preferences.forEach { it.id = 0 }
            employeeService.getByEmployeePrincipal(employeePrincipal)?.let { emp ->
                val existingPrefs = getOneTimeHourPreferencesByEmployeeAndPeriod(emp.id, day)
                existingPrefs.forEach { oneTimeHourPreferenceRepository.delete(it) }
                val savedPrefs = mutableListOf<OneTimeHourPreference>()
                newPref.preferences.forEach {
                    savedPrefs.add(oneTimeHourPreferenceRepository.save(OneTimeHourPreference(it, emp)))
                }
                return OneTimeHourPreferencesDto(savedPrefs)
            }
        }
        return null
    }

    /**
     * @param start (inclusive)
     * @param finish (inclusive)
     */
    private fun getOneTimeHourPreferencesByEmployeeAndPeriod(employeeId: Long, start: LocalDate, finish: LocalDate = start): List<OneTimeHourPreference> {
        return oneTimeHourPreferenceRepository.findByEmployeeAndPeriod(
                employeeId,
                start.atStartOfDay(),
                finish.atTime(LocalTime.MAX)
        )
    }

}