import { Injectable } from '@angular/core';
import { ApiService } from './common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	headers = new HttpHeaders({
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	});

	globalConfig: any;

	constructor(
		private apiService: ApiService,
		private http: HttpClient
	) { }

	getConfigs() {
		return this.apiService.getData('/config', {})
	}

	public load(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.getConfigs().subscribe((response: any) => {
				if (response?.status == 'success') {
					this.globalConfig = response.data;
					if(this.globalConfig?.service_type) {
						this.globalConfig.service_type = this.globalConfig.service_type?.map((item: any) => {
							item.full_name = item.name + ' - ' + item.vn_name;
							return item;
						});
					}
				}
				resolve(true);
			});
		});
	}

	getSetting() {
		return this.globalConfig;
	}

}
