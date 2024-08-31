import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import moment from "moment";
import { calendarConst, defaultDateFormatWithoutTime } from "../../constants";
import { LocalizationService } from "../../../services";

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'advance-date-picker',
	templateUrl: './advance-date-picker.component.html',
	styleUrls: ['./advance-date-picker.component.scss']
})
export class AdvanceDatePickerComponent implements OnInit, OnChanges {
	@Input() drops = 'down';
	@Input() className: string = '';
	@Input() singleDatePicker = false;
	@Input() alwaysShowCalendars: boolean = true;
	@Input() showCustomRangeLabel = false;
	@Input() autoApply = true;
	@Input() showRange: boolean = true;
	@Input() minDate: any;
	@Input() showClearButton: any = false;
	@Input() defaultDateFormat = defaultDateFormatWithoutTime;
	@Output() selectedRange = new EventEmitter<any>();
	@Input() selected: any;
	@Input() isReset: boolean = false;
	@Input() placeholder: string = 'Select range...';
	@Input() maxDate: any;
	@Input() style: string;

	constructor(private localizationService: LocalizationService) {
		this.alwaysShowCalendars = true;
		// this.selectedRange.emit( this.selected )
		if (this.ranges) Object.keys(this.ranges).forEach(key => {
			this.localizationService.localize(key)
		})
	}


	ranges: any = {
		[calendarConst.TODAY]: [moment(), moment()],
		[calendarConst.YESTERDAY]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		[calendarConst.LAST_7_DAYS]
			: [moment().subtract(6, 'days'), moment()],
		[calendarConst.LAST_30_DAYS]: [moment().subtract(29, 'days'), moment()],
		[calendarConst.THIS_MONTH]: [moment().startOf('month'), moment().endOf('month')],
		[calendarConst.PREV_MONTH]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
		[calendarConst.THIS_QUARTER]: [moment().startOf('quarter'), moment()],
		[calendarConst.PREV_QUARTER]: [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
	}

	invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
	isInvalidDate = (m: moment.Moment) => {
		return this.invalidDates.some(d => d.isSame(m, 'day'))
	}

	locale: any = {
		format: this.defaultDateFormat,
		separator: calendarConst.SEPARATOR,
		applyLabel: calendarConst.APPLY,
		cancelLabel: calendarConst.CANCEL,
		fromLabel: calendarConst.FROM,
		toLabel: calendarConst.TO,
		customRangeLabel: calendarConst.CUSTOM_RANGE,
		singleDatePickerLabel: 'Date',
		weekLabel: 'W',
		daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => this.localizationService.localize(day)),
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => this.localizationService.localize(month)),
		firstDay: 1
	};

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes.showRange?.currentValue == false) {
			this.ranges = null;
		}
	}

	change($event: any) {
		if ($event) {
			let selectedDate: any = {};
			selectedDate.startDate = $event.startDate?.format(this.defaultDateFormat);
			selectedDate.endDate = $event.endDate?.format(this.defaultDateFormat);
			this.selectedRange.emit({...selectedDate, isReset: this.isReset});
		} else {
			this.selectedRange.emit(null);
		}
	}
}
