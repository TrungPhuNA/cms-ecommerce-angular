import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from "../../services/auth.service";



/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!(req.url.includes('login') || req.url.includes('register'))) {
            // if the request has "Authorization" we return the request
            if (req.headers.has('Authorization')) {
                return next.handle(req);
            }
            const authToken = localStorage.getItem('access_token');
            let token = `Bearer ${authToken}`;
            let authReq = req.clone({
                headers: req.headers.set('Authorization', token)
            });
    
            if (req.headers.has('Content-Type')) {
                authReq = req.clone({
                    headers: req.headers.set('Authorization', token)
                });
            }
    
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
