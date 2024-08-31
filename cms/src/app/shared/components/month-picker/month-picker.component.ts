import {Component, Input, Output, OnInit, EventEmitter, HostListener, ElementRef} from '@angular/core';
import moment from "moment";

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit {

  @Input() selectedMonth = {
    month: moment().get('month') + 1,
    year: moment().get('year')
  };

  oldSelectedMonth: any;

  @Output() selected = new EventEmitter<any>();

  listYears = Array();

  showPicker = false;

  selectedTime = '';

  constructor(private eRef: ElementRef) {
  }


  ngOnInit() {
    this.oldSelectedMonth = JSON.parse(JSON.stringify(this.selectedMonth));
    this.selectedTime = this.selectedMonth.month + '/' + this.selectedMonth.year;

    let currentYear = moment().get('year'),
      startYear = 2019;

    while (startYear <= currentYear) {
      this.listYears.push(startYear);
      startYear++;
    }

  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if((event.target as Element).className.includes('ng-option')) return;
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.cancelChange();
    }
  }

  showBoxPicker() {
    this.oldSelectedMonth = JSON.parse(JSON.stringify(this.selectedMonth));
    this.showPicker = true;
  }

  changeMonth(month: number) {
    if(month == this.selectedMonth.month) this.change();
    else {
      this.selectedMonth.month = month;
      this.setTimeText();
    }
  }

  changeYear(year: number) {
    this.selectedMonth.year = year;
    this.setTimeText();
  }

  change() {
    this.showPicker = false;
    this.oldSelectedMonth = JSON.parse(JSON.stringify(this.selectedMonth));
    this.selected.emit(this.selectedMonth);
  }

  cancelChange() {
    this.selectedMonth = JSON.parse(JSON.stringify(this.oldSelectedMonth));
    this.setTimeText();
    this.showPicker = false;
  }

  setTimeText() {
    this.selectedTime = this.selectedMonth.month + '/' + this.selectedMonth.year;
  }
}
