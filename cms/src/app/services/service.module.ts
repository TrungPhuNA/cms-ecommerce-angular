import { NgModule } from "@angular/core";
import { ApiService, FileUploadService } from "./common";
import { LocalStorageService } from "./common/local-storage.service";
import { LocalizationService } from "./localization-service/localization.service";

@NgModule({
    declarations: [],
    providers: [
        ApiService,
        LocalStorageService,
        FileUploadService,
        LocalStorageService,
        LocalizationService,
    ],
    imports: [],
    exports: [],
})
export class ServiceModule {
}
