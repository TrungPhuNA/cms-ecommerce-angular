import { Injectable } from "@angular/core";
import { AlertService } from "../../services";
import { AuthService, UserType } from "../../services/auth.service";
import { Location } from "@angular/common";
import { AbstractControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class Helpers {

    constructor(
        public alertService: AlertService,
        public authService: AuthService,
        public location: Location
    ) {
    }

    getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    deleteCookie(name: string) {
        this.setCookie(name, '', -1);
    }

    setCookie(name: string, value: string, expireDays: number, path: string = '/') {
        let d: Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires: string = `expires=${d.toUTCString()}`;
        let cPath: string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cPath}`;
    }

    allowExt: string[] = ['BMP', 'bmp', 'gif', 'GIF', 'jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG', 'webp', 'WEBP'];

    validateFile(file: File) {
        if (file.type.indexOf('image') < 0) {
            this.alertService.fireSmall('error', 'File upload must be image!');
            return false;
        }

        if (file.size > 10240000) {
            this.alertService.fireSmall('error', 'Image must be less than 10MB!');
            return false;
        }
        let fileName = file.name;
        let extFile = fileName.split('.').pop();

        if (!this.allowExt.includes(extFile as string)) {
            this.alertService.fireSmall('error', 'This format is not supported');
            return false;
        }
        return true;
    }

    validateWhitespace(control: AbstractControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isContainWhitespace = /\s/.test(control.value || '');
        const isValid = !isWhitespace && !isContainWhitespace;
        return isValid ? null : { 'whitespace': true }
    }

    validateAWhitespace(control: AbstractControl) {
        const title = control.value;
        if (title && title.trim().length === 0) {
            return { whitespace: true };
        }
        return null;
    }

	
}
