import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs/operators";
import { ErrorService } from "./error.service";
import { ApiService } from './api.service';
@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private errorService: ErrorService, private apiService: ApiService) {
    }


    upload(file: any): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post(this.baseUrl + 'api/v1/adv/upload-file', formData)
            .pipe(catchError(error => error));
    }

    // uploadMultiImages(files: any): Observable<any> {
    //     const uploadData = new FormData();
    //     const headers = this.headers;
    //     if (files && files.length > 0) {
    //         files.forEach((file: File) => {
    //             uploadData.append('files[]', file);
    //         });
    //     }
    //     return this.http.post(this.baseUrl + '/api/v1/multi-upload', uploadData, { headers })
    //         .pipe(catchError(error => error));
    // }

}
