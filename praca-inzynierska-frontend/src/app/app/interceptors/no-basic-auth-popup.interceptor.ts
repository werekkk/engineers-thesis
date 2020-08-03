import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NoBasicAuthPopupInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers
            .set('X-Requested-With', 'XMLHttpRequest');
        const authReq = req.clone({ headers });
        return next.handle(authReq);
    }

}