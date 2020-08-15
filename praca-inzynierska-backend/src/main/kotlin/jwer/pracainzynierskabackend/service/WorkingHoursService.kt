package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.WorkingHoursDto
import jwer.pracainzynierskabackend.model.entity.WorkingHours
import jwer.pracainzynierskabackend.repository.WorkingHoursRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class WorkingHoursService @Autowired constructor(
        private val workplaceService: WorkplaceService,
        private val workingHoursRepository: WorkingHoursRepository
){

    fun getWorkingHours(principal: Principal): WorkingHoursDto? {
        workplaceService.getWorkplaceByPrincipal(principal)?.let {
            return WorkingHoursDto(it.workingHours)
        }
        return null
    }

    fun setWorkingHours(principal: Principal, workingHours: WorkingHoursDto): WorkingHoursDto? {
        workplaceService.getWorkplaceByEmployer(principal)?.let {
            val newWorkingHours = WorkingHours(
                    it.workingHours.id,
                    workingHours.monday,
                    workingHours.tuesday,
                    workingHours.wednesday,
                    workingHours.thursday,
                    workingHours.friday,
                    workingHours.saturday,
                    workingHours.sunday
            )
            val savedWorkingHours = workingHoursRepository.save(newWorkingHours)
            return WorkingHoursDto(savedWorkingHours)
        }
        return null
    }

}