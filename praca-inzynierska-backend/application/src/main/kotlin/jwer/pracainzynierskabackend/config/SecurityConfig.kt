package jwer.pracainzynierskabackend.config

import jwer.pracainzynierskabackend.model.auth.AccountRole
import jwer.pracainzynierskabackend.service.AuthenticationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http?.authorizeRequests()
                ?.antMatchers("/auth/user")?.permitAll()
                ?.antMatchers("/auth/**")?.hasAnyRole(AccountRole.EMPLOYEE, AccountRole.EMPLOYER)
                ?.antMatchers("/user/**")?.permitAll()
                ?.antMatchers("/employee/**")?.hasRole(AccountRole.EMPLOYER)
                ?.antMatchers("/position/**")?.hasRole(AccountRole.EMPLOYER)
                ?.antMatchers("/shift/employee")?.hasRole(AccountRole.EMPLOYEE)
                ?.antMatchers("/shift/**")?.hasRole(AccountRole.EMPLOYER)
                ?.antMatchers("/preference/**")?.hasRole(AccountRole.EMPLOYEE)
                ?.antMatchers("/staff-requirements/**")?.hasRole(AccountRole.EMPLOYER)
                ?.antMatchers(HttpMethod.GET, "/working-hours")?.hasAnyRole(AccountRole.EMPLOYEE, AccountRole.EMPLOYER)
                ?.antMatchers(HttpMethod.POST, "/working-hours")?.hasAnyRole(AccountRole.EMPLOYER)
                ?.and()
                ?.httpBasic()
                ?.and()
                ?.csrf()?.disable()
                ?.cors()
    }

    @Autowired
    fun configureGlobal(auth: AuthenticationManagerBuilder, authenticationService: AuthenticationService) {
        auth.userDetailsService(authenticationService)
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("*")
        configuration.allowedMethods = listOf("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH")
        configuration.allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type", "X-Requested-With")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}