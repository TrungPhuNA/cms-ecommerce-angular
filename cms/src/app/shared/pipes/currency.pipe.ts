import { Pipe, PipeTransform, Injectable } from '@angular/core';

/**
 * Append currency code according to env.
 */
@Pipe({ name: 'currency' })
@Injectable()
export class CurrencyPipe implements PipeTransform {

    transform(amountOfMoney: number, currencyCode: string): string {
        if (!amountOfMoney) {
            return '';
        }
        return amountOfMoney.toString() + ' ' + currencyCode;
    }
}