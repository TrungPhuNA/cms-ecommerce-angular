import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class CustomDateParserFormatter extends NgbDateParserFormatter {
	parse(value: string): NgbDateStruct | null {
		if (value) {
			const dateParts = value.trim().split('-');
			if (dateParts.length === 3) {
				return {
					day: parseInt(dateParts[0], 10),
					month: parseInt(dateParts[1], 10),
					year: parseInt(dateParts[2], 10)
				};
			}
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? `${this.pad(date.day)}-${this.pad(date.month)}-${date.year}` : '';
	}

	private pad(n: number): string {
		return n < 10 ? `0${n}` : `${n}`;
	}
}