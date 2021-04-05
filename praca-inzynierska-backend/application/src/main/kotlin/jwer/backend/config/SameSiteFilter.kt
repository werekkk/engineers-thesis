package jwer.backend.config

import org.springframework.http.HttpHeaders
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletResponse

class SameSiteFilter : GenericFilterBean() {

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
        if (response != null && request != null && response is HttpServletResponse) {
            chain?.doFilter(request, response)
            addSameSiteCookieAttribute(response)
        }
    }

    private fun addSameSiteCookieAttribute(response: HttpServletResponse) {
        response.addHeader(HttpHeaders.SET_COOKIE, "HttpOnly; SameSite=Strict")
    }

}