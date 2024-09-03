import { Component, Input } from "@angular/core";

@Component( {
  selector: "app-file-size-note",
  templateUrl: "./file-size-note.component.html",
  styleUrls: ["./file-size-note.component.scss"],
} )
export class FileSizeNoteComponent {
  @Input() imgSize: number
  @Input() maxSize: number
  @Input() noteLabel: string = "Dung lượng ảnh:"

  constructor() {
  }

}
