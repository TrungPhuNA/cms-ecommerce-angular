import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {

    constructor() { }

    sendEvent(eventName: string, eventParams?: { [key: string]: any }) {
        gtag('event', eventName, eventParams);
    }
}
