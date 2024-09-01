import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, first, map, Observable, of, Subscription,  } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseUserModel, UserModel } from "../auth";
import { API_V1, Helpers } from "../shared";
import { catchError } from "rxjs/operators";
import { AlertService, ApiService, HelperService } from "./common";
import moment from "moment";


export type UserType = UserModel | undefined;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	tokenField = environment.tokenField;
	loginCrmAdvKey = 'CMS_ECOMMERCE_V1';
	isLoading$: Observable<boolean>;

	loggedInStatus: boolean;
	isLoadingSubject: BehaviorSubject<boolean>;
	userInfo$: Subscription;

	currentUserSubject: BehaviorSubject<any>;
	currentUser$: Observable<any>;

	constructor(private http: HttpClient,
		private alertService: AlertService,
		private helperService: HelperService,
		private apiService: ApiService) {
		this.loggedInStatus = !!Helpers.prototype.getCookie(this.tokenField);
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.isLoading$ = this.isLoadingSubject.asObservable();
		this.currentUserSubject = new BehaviorSubject<any>(undefined);
		this.currentUser$ = this.currentUserSubject.asObservable();
	}

	headers = new HttpHeaders({
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	});


	register(data: any, type?: any): Observable<any> {
		let url = `admin/auth/register`;
		if(type) {
			url = 'auth/register'
		}
		return this.http.post<any>(`${this.getBaseUrl()}/${url}`, data).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		);
	}

    
	
	
	login(data: any, type?: any): Observable<any> {
		let url = `admin/auth/login`;
		if(type) {
			url = 'auth/login'
		}
		return this.http.post<any>(`${this.getBaseUrl()}/${url}`, data, { headers: this.headers })
			.pipe(catchError((err) => { return of(err) }));
	}

	logout() {
		localStorage.removeItem('username');
		localStorage.removeItem('user');
		localStorage.removeItem('user_id');
		localStorage.removeItem('access_token');
		localStorage.removeItem('user');
		this.loggedInStatus = false;
	}

	getMe(): Observable<any> {
		return this.http.get<ResponseUserModel>(`${this.getBaseUrl()}/admin/me`)
		.pipe(map(response => response), catchError((err) => { return of(err) }));
	}

	updateMe(data: any): Observable<any> {
		return this.http.put<ResponseUserModel>(`${this.getBaseUrl()}/admin/me`, data)
		.pipe(map(response => response), catchError((err) => { return of(err) }));
	}

    updatePassword(data: any): Observable<any> {
        return this.http.post<ResponseUserModel>(`${this.getBaseUrl()}/admin/update-password`, data).pipe(map(response => response), catchError((err) => { return of(err) }));
    }

	getUser(): Observable<any> {
		let user: any = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}

	setJwtToken(key: string, token: string, expire: number) {
		Helpers.prototype.setCookie(key, token, expire);
		this.loggedInStatus = true;
	}

	

	getBaseUrl() {
		return environment.apiUrl + API_V1;
	}

	logoutWithoutCache(params?: any) {
	}

	params(object: any) {
		const parameters = [];
		for (const property in object) {
			if (object.hasOwnProperty(property)) {
				parameters.push(encodeURI(property + '=' + object[property]));
			}
		}

		return parameters.join('&');
	}
    
}
