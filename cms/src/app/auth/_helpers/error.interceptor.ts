import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(private auth: AuthService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler):
		Observable<HttpEvent<any>> {

		return next.handle(req).pipe(catchError(err => {
			console.log("err---------> ", err);
			let dataError = err?.error?.error_code || null;
			if (err?.status === 401) {
				window.location.href = '/auth/login'
			}
			const error = err.error
			return throwError(error);
		}));
	}
}
