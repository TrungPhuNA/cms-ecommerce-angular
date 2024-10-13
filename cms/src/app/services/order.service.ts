import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

	constructor(
		private apiService: ApiService
	) { }
	getListData(filters: any) {
		return this.apiService.getData('/orders', filters);
	}

	showData(id: any) {
		return this.apiService.getData(`/orders/${id}`);
	}

	createOrUpdateData(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/orders/${id}`, data)
		}
		return this.apiService.postData(`/orders`, data);
	}

	deleteData(id: any) {
		return this.apiService.deleteData(`/orders/${id}`);
	}


	getListDataPayment(filters: any) {
		return this.apiService.getData('/payments-method', filters);
	}

	showDataPayment(id: any) {
		return this.apiService.getData(`/payments-method/${id}`);
	}

	createOrUpdateDataPayment(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/payments-method/${id}`, data)
		}
		return this.apiService.postData(`/payments-method`, data);
	}

	deleteDataPayment(id: any) {
		return this.apiService.deleteData(`/payments-method/${id}`);
	}
}