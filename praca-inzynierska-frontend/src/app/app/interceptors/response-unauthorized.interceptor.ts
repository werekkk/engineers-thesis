import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ResponseUnauthorizedInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/auth/logout') || 
        req.url.includes('/auth/authenticate') ||
        req.url.includes('/auth/user')) {
            return next.handle(req);
        } else {
            return next.handle(req).pipe(
                tap(
                    () => {},
                    err => {
                        if (err instanceof HttpErrorResponse && err.status == 401) {
                            this.authenticationService.logout().subscribe(
                                () => this.router.navigate(['unauthorized']),
                                () => this.router.navigate(['unauthorized'])
                            )
                        }
                    }
                )
            )
        }
    }

}