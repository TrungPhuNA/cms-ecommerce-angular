import { Injectable } from '@angular/core';

/** Local Storage Wrapper */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    /**
     * Set boolean type item
     *
     * @param {string} key
     * @param {boolean} value
     */
    setBooleanItem( key: string, value: boolean ): void {
        localStorage.setItem( key, Number( value ).toString() );
    }

    /**
     * Get boolean type item value
     *
     * @param {string} key
     * @return {boolean} value
     */
    getBooleanItem( key: string ): boolean {
        return Boolean( Number( localStorage.getItem( key ) ) );
    }

    /**
     * Set item
     *
     * @param {string} key
     * @param {any} value
     */
    setItem( key: string, value: any ): void {
        localStorage.setItem( key, value.toString() );
    }

    /**
     * Remove item
     *
     * @param {string} key
     */
    removeItem( key: string ): void {
        localStorage.removeItem( key );
    }

    /**
     * Get string type item value
     *
     * @param {string} key
     * @return {string | null} value
     */
    getStringItem( key: string ): string | null {
        return localStorage.getItem( key );
    }

    /**
     * Get number type item value
     *
     * @param {string} key
     * @return {number} value
     */
    getNumberItem( key: string ): number {
        return Number( localStorage.getItem( key ) );
    }

    /**
     * Get number of items
     *
     * @return {number} length
     */
    getLength(): number {
        return localStorage.length;
    }
}
