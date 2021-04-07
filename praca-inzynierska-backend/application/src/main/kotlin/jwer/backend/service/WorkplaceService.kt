package jwer.backend.service

import jwer.backend.model.auth.AccountType
import jwer.backend.model.entity.Workplace
import jwer.backend.repository.WorkplaceRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class WorkplaceService @Autowired constructor(
        private val workplaceRepository: WorkplaceRepository,
        private val userService: UserService
){

    fun getWorkplaceByPrincipal(principal: Principal): Workplace? {
        userService.getAccount(principal).let {
            return when(it.accountType) {
                AccountType.EMPLOYEE -> workplaceRepository.findByEmployeeUsername(it.username!!)
                AccountType.EMPLOYER -> workplaceRepository.findByEmployerUsername(it.username!!)
            }
        }
    }

    fun getWorkplaceByEmployer(principal: Principal): Workplace? {
        userService.getAccount(principal).let {
            return workplaceRepository.findByEmployerUsername(it.username!!)
        }
    }

}