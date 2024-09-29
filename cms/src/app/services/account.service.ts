import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
	providedIn: 'root'
})
export class AccountService {

	constructor(
		private apiService: ApiService
	) { }

	getListUser(filters: any) {
		return this.apiService.getData('/account', filters);
	}

	showUser(id: any) {
		return this.apiService.getData(`/account/${id}`);
	}

	createOrUpdateUser(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/account/${id}`, data)
		}
		return this.apiService.postData(`/account`, data);
	}

	deleteUser(id: any) {
		return this.apiService.deleteData(`/account/${id}`);
	}


	// Role
	getListRole(filters: any) {
		return this.apiService.getData('/account', filters);
	}

	showRole(id: any) {
		return this.apiService.getData(`/account/${id}`);
	}

	createOrUpdateRole(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/account/${id}`, data)
		}
		return this.apiService.postData(`/account`, data);
	}

	deleteRole(id: any) {
		return this.apiService.deleteData(`/account/${id}`);
	}


	// Permission


	getListPermission(filters: any) {
		return this.apiService.getData('/account', filters);
	}

	showPermission(id: any) {
		return this.apiService.getData(`/account/${id}`);
	}

	createOrUpdatePermission(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/account/${id}`, data)
		}
		return this.apiService.postData(`/account`, data);
	}

	deletePermission(id: any) {
		return this.apiService.deleteData(`/account/${id}`);
	}
}
