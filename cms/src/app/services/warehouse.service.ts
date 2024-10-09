import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
	providedIn: 'root'
})
export class WarehouseService {

	constructor(
		private apiService: ApiService
	) { }

	getListData(filters: any, type = 'stock-in') {
		return this.apiService.getData(`/${type}`, filters);
	}

	showData(id: any, type = 'stock-in') {
		return this.apiService.getData(`/${type}/${id}`);
	}

	createOrUpdateData(data: any, id: any = null, type = 'stock-in') {
		if (id) {
			return this.apiService.putData(`/${type}/${id}`, data)
		}
		return this.apiService.postData(`/${type}`, data);
	}

	deleteData(id: any, type = 'stock-in') {
		return this.apiService.deleteData(`/${type}/${id}`);
	}
}
