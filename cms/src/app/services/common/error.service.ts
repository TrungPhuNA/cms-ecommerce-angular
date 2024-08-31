import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor() { }

    handleError(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            console.error(`${operation} failed: ${error.message}`);
            return of(result);
        };
    }
}
