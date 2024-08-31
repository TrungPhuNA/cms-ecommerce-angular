import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class BaseSearchFormService {

    private baseSearchFormData = new BehaviorSubject(null);
    currentData = this.baseSearchFormData.asObservable();

    constructor() { }

    changeData(data: any) {
        this.baseSearchFormData.next(data);
    }

}
