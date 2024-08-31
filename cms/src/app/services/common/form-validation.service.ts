import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { REGEX_EMAIL, REGEX_PHONE, REGEX_PHONE_VN, REGEX_USERNAME_LOGIN } from 'src/app/shared/constants/regex-data';

@Injectable({
	providedIn: 'root'
})
export class FormValidatorService {

	constructor() { }

	usernameOrEmailValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const value = control.value;

			if (!value) {
				return null;  // don't validate empty value to allow required validator to handle it
			}

			const isValid = REGEX_USERNAME_LOGIN.test(value) || REGEX_EMAIL.test(value);
			return isValid ? null : { 'invalidUsernameOrEmail': true };
		};
	}

	phoneNumberValidator(notRegister = false): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const value = control.value;

			if (!value) {
				return null;  // don't validate empty value to allow required validator to handle it
			}

			let isValid = REGEX_PHONE_VN.test(value);
			if (notRegister) {
				isValid = REGEX_PHONE.test(value)
			}
			return isValid ? null : { 'pattern': true };
		};
	}

	dateRangeValidator(fromDateControlName: string, toDateControlName: string): ValidatorFn {
		return function (formGroup: any): { [key: string]: any; } | null {
			const fromDate = formGroup.get(fromDateControlName);
			const toDate = formGroup.get(toDateControlName);

			if (fromDate && toDate && fromDate.value && toDate.value) {
				const fromDateValue = moment(fromDate.value).startOf('days');
				const toDateValue = moment(toDate.value).startOf('days');

				if (fromDateValue.isAfter(toDateValue) ) {
					return { 'dateRangeInvalid': true };
				}
			}

			return null;
		};
	}
}
