import { NgModule } from "@angular/core";
import { FileSizeNoteComponent } from "./file-size-note.component";
import { NgClass, NgIf } from "@angular/common";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule( {
  declarations: [FileSizeNoteComponent],
    imports: [
        NgClass,
        NgIf,
        NgbTooltipModule
    ],
  exports: [FileSizeNoteComponent],
} )
export class FileSizeNoteModule {
}
