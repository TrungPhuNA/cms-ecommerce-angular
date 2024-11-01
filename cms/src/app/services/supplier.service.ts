import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

	constructor(
		private apiService: ApiService
	) { }

	getListData(filters: any) {
		return this.apiService.getData('/suppliers', filters);
	}

	showData(id: any) {
		return this.apiService.getData(`/suppliers/${id}`);
	}

	createOrUpdateData(data: any, id: any) {
		if(id) {
			return this.apiService.putData(`/suppliers/${id}`, data)
		}
		return this.apiService.postData(`/suppliers`, data);
	}

	deleteData(id: any) {
		return this.apiService.deleteData(`/suppliers/${id}`);
	}
}
