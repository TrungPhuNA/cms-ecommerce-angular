import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements AfterViewInit, OnChanges{
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  @Input() thisMonth: boolean;
  @Output() dateChange = new EventEmitter<any>()

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.thisMonth) {
        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');
        this.fromDate = {year: startDate.year(), month: startDate.month() + 1, day: startDate.date()} as NgbDate;
        this.toDate = {year: endDate.year(), month: endDate.month() + 1, day: endDate.date()} as NgbDate;

      }
  }

  ngAfterViewInit(): void {
    this.dateChange.emit([
      this.formatter.format(this.fromDate),
      this.formatter.format(this.toDate)
    ]);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.dateChange.emit([
      this.formatter.format(this.fromDate),
      this.formatter.format(this.toDate)
    ])
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
