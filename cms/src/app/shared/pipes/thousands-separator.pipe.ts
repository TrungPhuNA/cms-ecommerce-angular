import { Pipe, PipeTransform, Injectable } from '@angular/core';

/**
 * Thousands separator.
 */
@Pipe({ name: 'thousandsSeparator' })
@Injectable()
export class ThousandsSeparatorPipe implements PipeTransform {

	transform(num: number , currency: string = '', type?: number): string {
		if (num === null || num === undefined) {
			switch (type) {
				case 1:
					return '';
				case 2:
					return '0';
				default:
					return '0 đ';
			}
		}
		let value = num.toString()
		if(value?.endsWith('.00')) value = value.slice(0,-3);
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + currency;
	}
}


