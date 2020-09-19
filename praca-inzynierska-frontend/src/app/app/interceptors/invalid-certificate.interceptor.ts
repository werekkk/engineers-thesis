import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class InvalidCertificateInterceptor implements HttpInterceptor {

    constructor(
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(ev => {
                console.log("event", ev)
            }, err => {
                console.log("error", err)
            })
        )
    }

}