import {Component, Input} from "@angular/core";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'at-error',
  templateUrl: './form-invalid-message.component.html',
  styleUrls: ['./form-invalid-message.component.scss']
})
export class FormInvalidMessageComponent {
  @Input() control: any;
  @Input() submitted: any = false;
  @Input() validation: string = '';
  @Input() message: string = '';
  @Input() isForm = true;

  constructor() {
  }
}
