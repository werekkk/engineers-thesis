package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.OneTimeHourPreferencesDto
import jwer.pracainzynierskabackend.model.dto.PreferencesWeekDto
import jwer.pracainzynierskabackend.service.PreferenceService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import jwer.pracainzynierskabackend.utils.createResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.time.LocalDate

@RestController
@RequestMapping("/preference")
class PreferenceController @Autowired constructor(
        private val preferenceService: PreferenceService
) {

    @GetMapping("/week")
    fun getPreferencesWeekByPrincipal(principal: Principal): ResponseEntity<PreferencesWeekDto> {
        return preferenceService.getPreferencesByEmployeePrincipal(principal).createResponse()
    }

    @PostMapping("/week")
    fun savePreferencesWeekByPrincipal(principal: Principal, @RequestBody newPreferencesWeek: PreferencesWeekDto): ResponseEntity<PreferencesWeekDto> {
        return preferenceService.savePreferencesByEmployeePrincipal(principal, newPreferencesWeek).createResponse()
    }

    @GetMapping("/one-time")
    fun getOneTimeHourPreferencesByPrincipalAndPeriod(
            principal: Principal,
            @RequestParam(name = "start") @DateTimeFormat(pattern = "ddMMyyyy") start: LocalDate,
            @RequestParam(name = "finish") @DateTimeFormat(pattern = "ddMMyyyy") finish: LocalDate): ResponseEntity<OneTimeHourPreferencesDto> {
        return preferenceService.getOneTimeHourPreferencesInPeriod(principal, start, finish).createResponse()
    }

    @PostMapping("/one-time")
    fun setOneTimeHourPreferencesByPrincipalAndDay(
            principal: Principal,
            @RequestParam(name = "day") @DateTimeFormat(pattern = "ddMMyyyy") day: LocalDate,
            @RequestBody newPreferences: OneTimeHourPreferencesDto) : ResponseEntity<OneTimeHourPreferencesDto> {
        return ControllerUtils.createResponse(preferenceService.setOneTimeHourPreferencesForDay(principal, newPreferences, day))
    }

}