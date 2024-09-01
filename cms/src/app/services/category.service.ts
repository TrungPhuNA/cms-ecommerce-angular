import { Injectable } from '@angular/core';
import { ApiService } from './common';
import { finalize } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private apiService: ApiService
	) { }

	getListData(filters: any) {
		return this.apiService.getData('/categories', filters);
	}

	showData(id: any) {
		return this.apiService.getData(`/categories/${id}`);
	}

	createOrUpdateData(data: any, id: any) {
		if(id) {
			return this.apiService.putData(`/categories/${id}`, data)
		}
		return this.apiService.postData(`/categories`, data);
	}

	deleteData(id: any) {
		return this.apiService.deleteData(`/categories/${id}`);
	}

}
