import { Injectable } from '@angular/core';
import { ApiService } from './common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	constructor(
		private apiService: ApiService
	) { }
	getListData(filters: any) {
		return this.apiService.getData('/dashboard', filters);
	}

	
}