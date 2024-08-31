import { Injectable } from '@angular/core';
import { ApiService } from './common';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BriefService {

    constructor(
        private apiService: ApiService
    ) { }

    getSumaryBrief() {
        return this.apiService.getData('/static-briefs');
    }

    getBriefs(filters?: any): Observable<any> {
        return this.apiService.getData('/brief', filters);
    }

    showBrief(id: any) {
        return this.apiService.getData(`/brief/${id}`);
    }

    createBrief(data: any): Observable<any> {
        return this.apiService.postData('/brief', data);
    }

    updateBrief(id: any, data: any): Observable<any> {
        return this.apiService.putData(`/brief/${id}`, data);
    }

    updateBriefStatus(id: any, data: any) {
        return this.apiService.putData(`/brief/update-status/${id}`, data);
    }

}
