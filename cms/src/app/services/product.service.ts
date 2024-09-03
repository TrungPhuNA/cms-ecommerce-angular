import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(
		private apiService: ApiService
	) { }
	getListData(filters: any) {
		return this.apiService.getData('/products', filters);
	}

	showData(id: any) {
		return this.apiService.getData(`/products/${id}`);
	}

	createOrUpdateData(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/products/${id}`, data)
		}
		return this.apiService.postData(`/products`, data);
	}

	deleteData(id: any) {
		return this.apiService.deleteData(`/products/${id}`);
	}
}
