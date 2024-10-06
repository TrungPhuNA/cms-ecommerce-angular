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
		return this.apiService.getData('/roles', filters);
	}

	showRole(id: any) {
		return this.apiService.getData(`/roles/${id}`);
	}

	createOrUpdateRole(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/roles/${id}`, data)
		}
		return this.apiService.postData(`/roles`, data);
	}

	deleteRole(id: any) {
		return this.apiService.deleteData(`/roles/${id}`);
	}


	// Permission


	getListPermission(filters: any) {
		return this.apiService.getData('/permissions', filters);
	}

	showPermission(id: any) {
		return this.apiService.getData(`/permissions/${id}`);
	}

	createOrUpdatePermission(data: any, id: any) {
		if (id) {
			return this.apiService.putData(`/permissions/${id}`, data)
		}
		return this.apiService.postData(`/permissions`, data);
	}

	deletePermission(id: any) {
		return this.apiService.deleteData(`/permissions/${id}`);
	}
}
