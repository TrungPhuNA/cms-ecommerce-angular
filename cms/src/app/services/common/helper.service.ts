import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserType } from "../auth.service";
import { environment } from 'src/environments/environment';
import { DEFAULT_IMG } from 'src/app/shared/constants/common';

@Injectable({
	providedIn: 'root'
})
export class HelperService {

	constructor() { }
	

	buildItemParam(key: string, value: string | number | string[] | number[] | any, params: HttpParams): HttpParams {
		if(key == 'page' && !value) {
			params = params.append(`${key}`, '0');
		}
		if (value) {
			/**Với dạng filter mảng */
			if(Array.isArray(value)) {
				value.forEach((item: string | number| any) => {
					params = params.append(`${key}[]`, item);
				});
				return params;
			} else if(typeof value === 'object' && !Array.isArray(value) && value !== null) {
				/**Với dạng filter object */
				let newArrayValue = Object.entries(value);
				newArrayValue.forEach((element: any) => {
					if(element?.length > 0) {
						params = this.buildItemParam(`${key}[${element[0]}]`, element[1], params);
					}
				});
				// console.log(params);
				return params;
			} else {
				return params.append(`${key}`, value);
			}
		}
		return params;
	}

	buildParams(values: any) {
		let params = new HttpParams;
		if (values) {
			let arrCondition = Object.entries(values);
			arrCondition.forEach((element: any) =>{
				if(element[1] != null) {
					params = this.buildItemParam(element[0], element[1], params);
				}
			});
		}
		return params;
	}

	onTrimFocusOutForm(group: FormGroup, controlName: string, event: any) {
		// console.log(event);
		if (event) {
			this.setValueForm(group, controlName, event?.target?.value?.trim());
		}
	}

	onInputForm(group: FormGroup, controlName: string, event: any, condition: any) {
		if (event) {
			let value = event?.target?.value;
			if(condition?.trim) {
				value = value?.trim();
			}
			if(condition?.lower) {
				value = value?.toLowerCase();
			}
			if(condition?.upper) {
				value = value?.toUpperCase();
			}
			this.setValueForm(group, controlName, value);
		}
	}

	showStatusError(formGroup: FormGroup, name: string, submitted = false) {
		let check = formGroup?.controls[`${name}`]?.invalid && (this.checkTouchOrDirty(formGroup, name) || submitted);
		return check
	}

	checkTouchOrDirty(formGroup: FormGroup, name: string) {
		return formGroup?.controls[`${name}`]?.dirty || formGroup?.controls[`${name}`]?.touched
	}

	setValueForm(group: FormGroup, controlName: string, value: any) {
		if (value != '') {
			group?.controls[`${controlName}`]?.setValue(value);
		} else {
			group?.controls[`${controlName}`]?.setValue(null);
		}
	}

	checkRole(userInfo: UserType, roleName: string) {
		if (!userInfo) return false;
		let roles = userInfo.roles;
		let flag = false;
		roles.map((role: any) => {
			if (role.name === roleName) flag = true;
		});
		return flag;
	}

	checkPermission(userInfo: UserType, permissionName: string) {
		if (!userInfo) return false;
		let permissions = userInfo.permissions;
		let flag = false;
		permissions.map((permission: any) => {
			if (permission.name === permissionName) flag = true;
		});
		return flag;
	}

	arrayNumber = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
	readTwoNumber(number: number, fullString: any) {
		let result = '';
		if (number) {
			const tens = Math.floor(number / 10);
			const endNumber = number % 10;

			if (tens > 1) {
				result = ' ' + this.arrayNumber[tens] + ' mươi';
				if (endNumber == 1) {
					result += ' mốt';
				}
			} else if (tens == 1) {
				result = ' mười';
				if (endNumber == 1) {
					result += ' một';
				}
			} else if (fullString && endNumber > 0) {
				result = ' lẻ';
			}
			if (endNumber == 5 && tens > 1) {
				result += ' lăm';
			} else if (endNumber > 1 || (endNumber == 1 && tens == 0)) {
				result += ' ' + this.arrayNumber[endNumber];
			}
		}
		return result;
	}

	readBlock(number: number, fullString: any) {
		if (number) {
			let result = '';
			const numHundreds = Math.floor(number / 100);
			number = number % 100;
			if (fullString || numHundreds > 0) {
				result = ' ' + this.arrayNumber[numHundreds] + ' trăm';
				result += this.readTwoNumber(number, true);
			} else {
				result = this.readTwoNumber(number, false);
			}
			return result;
		}
		return '';
	}

	readMilions(number: number, fullString: any) {
		let result = '';
		const numMilions = Math.floor(number / 1000000);
		number = number % 1000000;
		if (numMilions > 0) {
			result = this.readBlock(numMilions, fullString) + ' triệu';
			fullString = true;
		}
		const numThoundsands = Math.floor(number / 1000);
		number = number % 1000;
		if (numThoundsands > 0) {
			result += this.readBlock(numThoundsands, fullString) + ' nghìn';
			fullString = true;
		}
		if (number > 0) {
			result += this.readBlock(number, fullString);
		}
		return result;
	}

	convertNumberToText(number: number) {
		if (number == 0) {
			return this.arrayNumber[0];
		}
		number = Math.round(number);
		let result = '',
			suffix = '';
		do {
			const ty = number % 1000000000;
			number = Math.floor(number / 1000000000);
			if (number > 0) {
				result = this.readMilions(ty, true) + suffix + result;
			} else {
				result = this.readMilions(ty, false) + suffix + result;
			}
			suffix = ' tỷ';
		} while (number > 0);
		return result;
	}


	getLocalStorage(key: string, type: any = 'obj' ) {
		let data = localStorage.getItem(key) || null;
		if(type == 'string') return data;
		return data ? JSON.parse(data) : null
	}

	setLocalStorage(key: string, value: any) {
		localStorage.setItem(key, value);
	}

	removeLocalStorage(key: string) {
		localStorage.removeItem(key);
	}

	/**Build with params like 'filters[status][start] = 1' */
	buildSearchValueByKeyFilter(searchValue: any, key: any = 'filters', paramKey?: any) {
		let params: any = {};
		if(searchValue) {
			let arrCondition = Object.entries(searchValue);
			arrCondition.forEach((element: any) =>{
				let keyObj = paramKey || key;
				if(element[1] != null && 
					typeof element[1] === 'object' && !Array.isArray(element[1])
					) {
					let keyElement = `${keyObj}[${element[0]}]`;
					let dataBuild = this.buildSearchValueByKeyFilter(element[1], '', keyElement);
					params = {...params, ...dataBuild};
				} else if(element[1] != null) {
					params[`${keyObj}[${element[0]}]`] = element[1];
				}
			});
			return params;
		}
		return null;
	}


	genConfigDataByKey(configs: any, key: any, value: any) {
		if(configs) {
			let configsByKey = configs[`${key}`]?.find((item: any) => item?.value == value);
			return configsByKey;
		}
		return {
			name: null,
			total: null,
			className: null
		}
	}

	addValidatorForm(formGroup: FormGroup, controlName: string, validators: any) {
		formGroup?.get(`${controlName}`)?.addValidators(validators);
		formGroup?.get(`${controlName}`)?.updateValueAndValidity();
	}

	clearValidator(formGroup: FormGroup, controlName: string) {
		formGroup?.get(`${controlName}`)?.clearValidators();
		formGroup?.get(`${controlName}`)?.updateValueAndValidity();
	}

	disableForm(formGroup: FormGroup, controlName: string) {
		formGroup?.get(`${controlName}`)?.disable();
	}

	enableForm(formGroup: FormGroup, controlName: string) {
		formGroup?.get(`${controlName}`)?.enable();
	}

	getItemLocalStorage(key: any, type = 'string') {
		let data = localStorage.getItem(key);
		if(type == 'obj' && data) {
			return JSON.parse(data);
		}
		return data;
	}

	setItemLocalStorage(key: any, value: any) {
		localStorage.setItem(key, value);
	}

	removeItemLocalStorage(key: any) {
		localStorage.removeItem(key)
	}

	buildPaging(meta: any) {
		return {
			page: meta?.current_page || meta?.page,
			total: meta?.total || 0,
			page_size: meta?.per_page || meta?.page_size
		}
	}

	buildImage(image: any, is_user: any = false) {
		if(image) {
			return `${environment.apiUrl}api/v1/${image}`
		}
		return is_user? DEFAULT_IMG : DEFAULT_IMG;
	}

	
}
