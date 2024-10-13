import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';


@Directive({
	selector: '[appInputNumber]'
})
export class InputNumberDirective {

	@Output() ngModelChange: EventEmitter<any> = new EventEmitter();

	@Input() onlyNumber: boolean = true;
	@Input() negativeNumber: boolean = false;
	@Input() limitLength: boolean = false;
	@Input() max?: any;
	@Input() min?: any;
	@Input() floatLength: number = 0;

	oldVal: any;
	countCharacter: number = 0;

	constructor(
		private elementRef: ElementRef
	) {
	}

	ngOnInit = () => {
		setTimeout(() => {
			if (this.elementRef.nativeElement.value) {
				this.oldVal = this.elementRef.nativeElement.value;
				this.elementRef.nativeElement.value = this.insertComma(this.elementRef.nativeElement.value);
				console.log("timeout--------> ", this.oldVal, this.elementRef.nativeElement.value);
			}
		}, 0);
	}

	@HostListener('focusin', ['$event'])
	onFocusin(event: any) {

		let value = event.target.value;
		if (value.length >= 4) {
			this.countCharacter = 0;
		}
		if (value) {
			value = this.deleteComma(value);
			this.oldVal = value;
			this.elementRef.nativeElement.value = value;
			this.elementRef.nativeElement.select()
		}
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent) {
		if (this.onlyNumber) {
			const clipboardData = event.clipboardData || (window as any).clipboardData;
			const pastedText = clipboardData.getData('text')?.replaceAll(',', '');

			// Check if the pasted text is not a number
			if (isNaN(Number(pastedText))) {
				event.preventDefault(); // Prevent paste if it's not a number
			}
		}


	}

	@HostListener('focusout', ['$event'])
	onFocusout(event: any) {
		if (event.target.value) {
			event.target.value = this.insertComma(event.target.value);
		}
	}

	@HostListener('input', ['$event'])
	onInput(event: any): any {
		let value = event.target.value;
		if (value == '00') {
			this.elementRef.nativeElement.value = 0;
		}
		if (this.max && parseInt(value) > this.max) {
			this.ngModelChange.emit(this.oldVal);
			this.elementRef.nativeElement.value = this.oldVal;
		} else if (value == '') {
			this.oldVal = '';
			this.countCharacter = 0;
		} else if (value == '-' || (value.length >= 1 && !isNaN(Math.sign(value)))) {

			if (this.floatLength && value.split(',')[1]?.length > this.floatLength) {
				this.oldVal = `${value.split(',')[0]},${value.split(',')[1].slice(0, this.floatLength)}`;
				this.elementRef.nativeElement.value = this.oldVal;
			} else {
				this.oldVal = value;
			}
			this.countCharacter = value.length;

		} else {

			this.ngModelChange.emit(this.oldVal);
			this.elementRef.nativeElement.value = this.oldVal;
		}

	}

	@HostListener('keypress', ['$event'])
	onKeypress(event: any) {
		let value = event.target.value;
		if (this.onlyNumber) {
			const charCode = (event.which) ? event.which : event.keyCode;
			if (this.negativeNumber) {
				if (this.oldVal == '-') {
					this.oldVal = 0;
					this.ngModelChange.emit(this.oldVal);
					this.elementRef.nativeElement.value = this.oldVal;
					return false;
				}

				if (charCode === 45) {
					if (this.oldVal == "-" || (this.oldVal && this.oldVal.toString().includes("-"))) {
						return false;
					}
					return true;
				}

				if (this.limitLength) {
					if (value > 0) {
						if (this.countCharacter >= 4) {
							return false;
						}
					} else {
						if (this.countCharacter >= 8) {
							return false;
						}
					}
				}
			}

			// // 47 --> dấu  '.'
			// // 44: ','
			// console.log("charCode---------> ",this.floatLength, charCode);
			// if (this.floatLength && charCode > 31 && ((charCode < 44 && (charCode > 44 && charCode < 47)) || charCode > 57)) {
			// 	console.log("float----> ", charCode);
			// 	return false;

			// } else if (!this.floatLength && charCode > 31 && (charCode < 48 || charCode > 57)) {
			// 	return false;
			// }
			// Cho phép chữ số, dấu ',' và dấu '.'
			if (this.onlyNumber && 
				!((charCode >= 48 && charCode <= 57))) {
				event.preventDefault();
			}
			
			this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.replace(/^0+/, '');
		}
		return true;
	}

	deleteComma(str: string) {
		return str.replace(/[,.]/g, '');
	}

	insertComma(str: string) {
		const parts = str.split(',');
		let int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		let decimal = parts[1]?.length > 0 ? `,${parts[1].slice(0, this.floatLength)}` : '';
		return `${int}${decimal}`;
	}

	countStr(str: any, searchStr: any) {
		if (!searchStr || !str) return 0;
		let count = 0
		let position = str.indexOf(searchStr);
		while (position !== -1) {
			count++;
			position = str.indexOf(searchStr, position + count);
		}
		return count;
	}

}
