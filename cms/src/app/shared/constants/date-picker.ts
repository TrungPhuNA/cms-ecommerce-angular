import moment from "moment";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export const reportMinDate: string = '2013-01-01';
export const maxOneYearPeriod: number = 365;
export const maximumNumberOfFutureMonths: number = 2;

export const defaultDateFormat: string = 'dd/MM/yyyy HH:mm:ss';
export const fullDateTimeCondition = 'YYYY-MM-DD HH:mm:ss'
export const defaultDateFormatWithoutTime: string = 'DD/MM/YYYY';

export class calendarConst {
  constructor() {
  }

  static readonly ALL = 'All';
  static readonly TODAY = 'Today';
  static readonly YESTERDAY = 'Yesterday';
  // @ts-ignore
  static readonly LAST_7_DAYS = `Last 7 days`;
  static readonly LAST_30_DAYS = 'Last 30 days';
  static readonly THIS_MONTH = 'This month';
  static readonly PREV_MONTH = 'Prev month';
  static readonly CUSTOM_RANGE = 'Custom range';
  static readonly THIS_QUARTER = 'This quarter';
  static readonly PREV_QUARTER = 'Prev quarter';
  static readonly APPLY = 'Apply';
  static readonly CANCEL = 'Cancel';
  static readonly FROM = 'From';
  static readonly TO = 'To';
  static readonly SEPARATOR = ' - ';
}

export const currentDate: NgbDateStruct = {
  year: moment().year(),
  month: moment().month() + 1,
  day: moment().date()
}
export const nextDate: NgbDateStruct = {
  year: moment().add( 1, 'days' ).year(),
  month: moment().add( 1, 'days' ).month() + 1,
  day: moment().add( 1, 'days' ).date()
}

export const initTime: NgbTimeStruct = {
  hour: moment().minute() < 30 ? moment().hour() : moment().hour() + 1,
  minute: moment().minute() < 30 ? 30 : 0,
  second: 0
}
