import { Injectable } from '@angular/core';
import {ApiService} from "./common";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

    constructor(
        private apiService: ApiService
    ) { }

    getListData(filters: any) {
        return this.apiService.getData('/payments-method', filters);
    }
}
