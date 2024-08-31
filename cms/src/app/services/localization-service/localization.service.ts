import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from 'rxjs';

@Injectable()
export class LocalizationService {

  constructor(private translateService: TranslateService) {
  }

  /**
   * Load translation of multiple strings at once
   * @param {string} messages - an array string want to be translated
   */
  localizeMultiple(messages: string[]): void {
    for (let index in messages) {
      this.translateService.get(messages[index]).subscribe((localizedMessage: string) => {
        messages[index] = localizedMessage;
      });
    }
  }

  /**
   * Load translation of single string at once
   * @param message - a string want to be translated.
   * @returns {string}
   */
  localize(message: string): string {
    this.translateService.get(message).subscribe(
      (localizedMessage: string) => {
        message = localizedMessage;
      });
    return message;
  }

  /**
   * load translation of 1 string contains parameters
   * @param {string} localizationString - the key in localization file (.json)
   * @param {object} parameters
   * @returns {Observable<string>}
   */
  localizeWithParameters(localizationString: string, parameters?: any): Observable<string> {
    return this.translateService.get(localizationString, parameters);
  }
}
