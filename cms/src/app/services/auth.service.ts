import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, first, map, Observable, of, Subscription, switchMap } from "rxjs";
import { environment } from "../../environments/environment";
import { PARTNER_TOKEN, ResponseUserModel, UserModel } from "../auth";
import { API_CORE, API_V1, Helpers } from "../shared";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { AlertService, ApiService, HelperService } from "./common";
import moment from "moment";
import sha256 from 'crypto-js/sha256';


export type UserType = UserModel | undefined;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	tokenField = environment.tokenField;
	partnerTokenKey = PARTNER_TOKEN;
	loginCrmAdvKey = 'loginCrmAdv';
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
        'x-type': 'ADV',
	});

	verifyGoogleToken(code: string, redirectUrl: string) {
		const payload = JSON.stringify({ 'code': code, 'redirect_url': redirectUrl });
		return this.http.post<any>(`${this.getBaseUrl()}/user/login_google`, payload, { headers: this.headers })
			.pipe(
				first(),
				map((resp) => {
					if (resp.token) {
						this.setJwtToken(this.partnerTokenKey, resp.token_1_point_5, resp.expire);
						this.setJwtToken(this.tokenField, resp.token, resp.expire);
						Helpers.prototype.setCookie(this.loginCrmAdvKey, moment().format(), 7)
						this.logoutAfterTimeout();
						return
					}
					if (resp.errors) {
						return this.alertService.fireSmall('error', 'Invalid token');
					}
					if (resp.message) {
						return this.alertService.fireSmall('error', resp.message);
					}
				}),
				catchError((err) => {
					Swal.fire({
						text: err.message,
						icon: 'error',
						toast: true,
						position: 'top-right',
						showConfirmButton: false,
						timer: 2000
					})
					return of(undefined);
				})
			);
	}

	logoutAfterTimeout(): void {
		const loginTime = moment(Helpers.prototype.getCookie(this.loginCrmAdvKey));
		if (!loginTime) {
			this.logout();
			return;
		}
		const logoutTime = loginTime.add(6, 'hours');
		const now = moment();
		const timeToLogout = logoutTime.diff(now);
		setTimeout(() => {
			this.logout();
		}, timeToLogout);
	}

	register(data: any, type?: any): Observable<any> {
		let url = `register-account`;
		if(type == 'social') {
			url = 'register-social'
		}
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/${url}`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		);
	}

    registerPub(data: any):Observable<any> {
        return this.http.put<any>(`${this.getBaseUrl()}/oauth/update-user`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		);
    }

	activeAccount(data: any): Observable<any> {
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/active-account`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		);
	}

	checkActiveAccount(data: any): Observable<any> {
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/check-active`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		)
	}

	login(data: any): Observable<any> {
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/login`, data, { headers: this.headers })
			.pipe(
				first(),
				map((res) => {
					//set token
					if (res.data) {
						this.setDataAccount(res.data);
						this.setJwtToken(this.tokenField, res.data.access_token, res.data.expires_in);
						Helpers.prototype.setCookie(this.loginCrmAdvKey, moment().format(), 7);
						// this.logoutAfterTimeout();
						return res;
					}
					if (res.message) {
						return this.alertService.fireSmall('error', res.message);
					}
				}),
				catchError((err) => { return of(err) })
			);
	}

	loginByAccessToken(data: any): Observable<any> {
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/login-by-token`, {access_token: data?.access_token}, { headers: this.headers })
			.pipe(
				first(),
				map((res) => {
					//set token
					let userInfo = this.helperService.getLocalStorage('user_crm_info')
					if (res.data) {
						let dataRes = {...data, ...res.data};
						this.setDataAccount(dataRes);
						this.setJwtToken(this.tokenField, dataRes?.access_token, dataRes?.expires_in);
						Helpers.prototype.setCookie(this.loginCrmAdvKey, moment().format(), 7);
						// this.logoutAfterTimeout();
						return res;
					}
					if (res.message) {
						return this.alertService.fireSmall('error', res.message);
					}
				}),
				catchError((err) => { return of(err) })
			);
	}

	logout() {
		localStorage.removeItem('username');
		localStorage.removeItem('user_id');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user_crm_info');
		Helpers.prototype.deleteCookie('jwt');
		Helpers.prototype.deleteCookie('loginCrmAdv');
		this.helperService.removeLocalStorage('login_type');
		this.loggedInStatus = false;
	}

	get isLoggedIn() {
		return this.loggedInStatus;
	}

	getAuthorizationToken(): string | undefined {
		if (Helpers.prototype.getCookie(this.tokenField)) {
			return Helpers.prototype.getCookie(this.tokenField);
		}
		return undefined;
	}

	getPartnerToken(): string | undefined {
		if (Helpers.prototype.getCookie(this.partnerTokenKey)) {
			return Helpers.prototype.getCookie(this.partnerTokenKey);
		}
		return undefined;
	}

	getMe(): Observable<any> {
		return this.http.get<ResponseUserModel>(`${this.getBaseUrl()}/adv/me`, {
			headers: {
				'Authorization': `Bearer ${this.getAuthorizationToken()}`,
			}
		});
	}

	updateMe(data: any): Observable<any> {
		return this.http.put<ResponseUserModel>(`${this.getBaseUrl()}/adv/me`, data, {
			headers: {
				'Authorization': `Bearer ${this.getAuthorizationToken()}`,
			}
		}).pipe(map(response => response), catchError((err) => { return of(err) }));
	}

    updatePassword(data: any): Observable<any> {
        return this.http.post<ResponseUserModel>(`${this.getBaseUrl()}/adv/update-password`, data, {
			headers: {
				'Authorization': `Bearer ${this.getAuthorizationToken()}`,
			}
		}).pipe(map(response => response), catchError((err) => { return of(err) }));
    }

	getUser(): Observable<any> {
		let user: any = localStorage.getItem('user_crm_info');
		return user ? JSON.parse(user) : null;
	}

	setJwtToken(key: string, token: string, expire: number) {
		Helpers.prototype.setCookie(key, token, expire);
		this.loggedInStatus = true;
	}

	

	getBaseUrl() {
		return environment.apiUrl + API_V1;
	}

	getUrlAdv() {
		return environment.apiUrl + API_CORE + '/crosscheck-service' + API_V1;
	}

	getCaptchaKey() {
		return environment.google_captcha_site_key;
	}

	setDataAccount(data: any) {
		localStorage.setItem('refresh_token', data.refresh_token);
		localStorage.setItem('user_crm_info', JSON.stringify({ ...data.user, 
			username: data?.user_name || data?.username || data?.user?.username, 
			user_id: data?.user_id || data?.user?.id
		}));
		localStorage.setItem('user_id', data?.user_id || data?.user?.id);
		localStorage.setItem('username', data?.user_name || data?.username || data?.user?.username);
	}

	resendActive(data: any) {
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/resend-active`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		)
	}

	loginSocial(provider: any = 'google') {
		let params: any = {
			client_id: environment.client_id,
			provider: provider,
			scope: 'user_info',
			response_type: 'code',
			redirect_uri: environment.domain + '/auth/login',
			state: sha256('loginaccesstrade' + moment().format('DDMMYYYHHMMSS'))
		}
		
		let oauthSso = `${environment.sso_url}/oauth/authorize?${this.params(params)}`;
		window.location.href = oauthSso;
	}

	logoutWithoutCache(params?: any) {

		this.helperService.removeLocalStorage('user_crm_info');
		this.helperService.removeLocalStorage('login_type');
		let authUrl = `${environment.sso_url}/logout`;
		let pr: any = null;
		if(params) {
			delete params.code;
			delete params.state;
			pr =  new URLSearchParams(params);
		}
		this.logout();
		const parameters = {
		'redirect_uri' : environment.domain + `/auth/login${pr ? '?' + pr : ''}`,
		};
		authUrl += '?' + this.params(parameters);

		window.location.href = authUrl;
	}


	getAccessToken(code: any) {
		let data = {
			'grant_type': 'authorization_code',
			'code': code,
			redirect_uri: environment.domain + '/auth/login',
		}
		
		return this.http.post<any>(`${this.getBaseUrl()}/oauth/login-social`, data, { headers: this.headers })
		.pipe(catchError(error => of(error)))

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

	switchAccount(token: any) {
		return this.http.get<any>(`${this.getBaseUrl()}/oauth/switch-account`, {params: {token: token}})
			.pipe(
				first(),
				map((res) => {
					//set token
					if(res?.status == 'success') {
						if (res.data) {
							let dataRes = {...res.data};
							this.setDataAccount(dataRes);
							let d: Date = new Date();
        					let cacheExpired = d.getTime() + 0.5 * 24 * 60 * 60 * 1000;
							this.setJwtToken(this.tokenField, dataRes?.access_token, cacheExpired);
							Helpers.prototype.setCookie(this.loginCrmAdvKey, moment().format(), 0.5);
							// this.logoutAfterTimeout();
							return res;
						}
					} else {
						return res;
					}
				}),
				catchError((err) => { return of(err) })
			);
	}

    forgotPassword(data: any) {
        return this.http.post<any>(`${this.getBaseUrl()}/oauth/reset-password`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		);
    }

    resetPassword(data: any) {
        return this.http.post<any>(`${this.getBaseUrl()}/oauth/renew-password`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		)
    }
    
    verifyOtp(data: any) {
        return this.http.post<any>(`${this.getBaseUrl()}/oauth/verify-otp-password`, data, { headers: this.headers }).pipe(
			map(response => response),
			catchError((err) => { return of(err) })
		)
    }
}
