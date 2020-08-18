package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.entity.Workplace
import jwer.pracainzynierskabackend.repository.WorkplaceRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class WorkplaceService @Autowired constructor(
        private val workplaceRepository: WorkplaceRepository,
        private val userService: UserService
){

    fun getWorkplaceByPrincipal(principal: Principal): Workplace? {
        userService.getAccount(principal)?.let {
            return when(it.accountType) {
                AccountType.EMPLOYEE -> workplaceRepository.findByEmployeeUsername(it.username!!)
                AccountType.EMPLOYER -> workplaceRepository.findByEmployerUsername(it.username!!)
                AccountType.ADMIN -> null
            }
        }
    }

    fun getWorkplaceByEmployer(principal: Principal): Workplace? {
        userService.getAccount(principal)?.let {
            return workplaceRepository.findByEmployerUsername(it.username!!)
        }
    }

}