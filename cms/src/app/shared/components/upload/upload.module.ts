import {NgModule} from "@angular/core";
import {UploadImageComponent} from "./upload-image.component";
import { CommonModule, NgClass, NgForOf, NgIf, NgStyle } from "@angular/common";
import { FileSizeNoteModule } from "../file-size-note/file-size-note.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  imports: [
    NgStyle,
    NgForOf,
    NgIf,
    NgClass,
    FileSizeNoteModule,
    NgbTooltipModule,
    MatInputModule,
    CommonModule
  ],
  declarations: [UploadImageComponent],
  exports: [UploadImageComponent]
})
export class UploadModule {
}
