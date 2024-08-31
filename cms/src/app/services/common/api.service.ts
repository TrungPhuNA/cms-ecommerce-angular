import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { API_V1 } from "../../shared";
import { AuthService } from "../auth.service";
import { HelperService } from './helper.service';
import _ from "lodash";
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    destroy$: Subject<void> = new Subject<void>();
    headers: any;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private helperService: HelperService,
        private alertService: AlertService
    ) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-type': 'ADV',
        });
    }


    getBaseApiUrl(): string {
        return environment.apiUrl + API_V1 + '/adv';
    }

    getData(path: string, filters?: any): Observable<any> {
        let params = this.helperService.buildParams(filters);
        return this.http.get<any>(this.getBaseApiUrl() + path, { headers: this.headers, params: params }).pipe(
            map(response => response),
            catchError(response => { return of(response) })
        );
    }

    postData(path: string, data?: any): Observable<any> {
        return this.http.post(this.getBaseApiUrl() + path, data, { headers: this.headers }).pipe(
            map(response => response),
            catchError(error => { return of(error) })
        );
    }

    putData(path: string, data?: any): Observable<any> {
        return this.http.put(this.getBaseApiUrl() + path, data, { headers: this.headers }).pipe(
            map(response => response),
            catchError(error => { return of(error) })
        );
    }

    deleteData(path: string): Observable<any> {
        return this.http.delete(this.getBaseApiUrl() + path, { headers: this.headers }).pipe(
            map(response => response),
            catchError(error => { return of(error) })
        );
    }

    handleError(error?: Error): Observable<any> {
        return of({
            status: 'error',
            data: null,
            message: error ? this.checkErrorMessage(error) : 'Có lỗi xảy ra, vui lòng thử lại!'
        });
    }

    checkErrorMessage(error: any) {
        if (!_.isEmpty(error)) {
            if (!_.isEmpty(error.data) && Object.keys.length > 0) {
                if (Object.values(error.data)[0]) return Object.values(error.data)[0];
                else return error.message;
            } else return error.message;
        } else return 'Có lỗi xảy ra! Vui lòng thử lại sau.';
    }
}
