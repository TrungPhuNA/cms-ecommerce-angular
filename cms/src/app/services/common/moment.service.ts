import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  readonly days: any = 'days';
  readonly week: any = 'week';
  readonly month: any = 'month';
  readonly year: any = 'year';
  readonly longDateFormat: string = 'MMM DD, YYYY';
  readonly mediumDateFormat: string = 'MMM DD';
  readonly defaultDateFormat: string = 'YYYY-MM-DD';
  readonly slashDateFormat: string = 'YYYY/MM/DD';
  readonly longMonthFormat: string = 'MMM YYYY';
  readonly defaultMonthFormat: string = 'YYYY-MM';
  readonly dateRangeSeparator: string = ' ~ ';
  readonly slashDateEndWithYearFormat: string = 'DD/MM/YYYY';
  readonly defaultDateTimeFormat: string = 'YYYY-MM-DD HH:mm:ss';

  /**
   * Generate a number of unix time in seconds.
   * @return {number} A number of unix time in seconds.
   */
  getUnixTimeInSeconds(): number {
    return this.getMoment().unix();
  }

  /**
   * Generate a date range string by start/end date and a specified date format.
   * @return {string} A string of date range.
   * @param startDate
   * @param endDate
   * @param dateFormat
   */
  generateDateRange(startDate: any, endDate: any, dateFormat: any): string {
    return this.getMomentDate(startDate).format(dateFormat)
      + this.dateRangeSeparator
      + this.getMomentDate(endDate).format(dateFormat);
  }

  /**
   * Format the date by default format.
   * @return {any} Date of a day in default format.
   * @param momentDate
   * @param dateFormat
   */
  formatDate(momentDate: any, dateFormat: string = this.defaultDateFormat): string {
    return momentDate.format(dateFormat);
  }

  /**
   * Format the month by default format.
   * @return {any} Month of a day in default format.
   * @param momentDate
   * @param monthFormat
   */
  formatMonth(momentDate: any, monthFormat: string = this.defaultMonthFormat): string {
    return momentDate.format(monthFormat);
  }

  /**
   * Get the date of first day of a month in default format.
   * @return {string} First day of a month in default date format.
   * @param month
   */
  getStartDateOfMonth(month: string): string {
    return month + '-01';
  }

  /**
   * Get the date of today in default format.
   * @return {any} Date of today in default format.
   */
  getDateToday(): string {
    return this.formatDate(this.getMoment());
  }

  /**
   * Get the date of a day n days before in default format.
   * @return {any} Date of a day in default format.
   * @param numberOfDaysBefore
   * @param dateFormat
   */
  getDateDaysBefore(numberOfDaysBefore: number, dateFormat: string = this.defaultDateFormat): string {
    return this.formatDate(this.getMomentDateDaysBefore(numberOfDaysBefore), dateFormat);
  }

  /**
   * Get the date of a day n days before with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfDaysBefore
   */
  getMomentDateDaysBefore(numberOfDaysBefore: number): any {
    return this.getMoment().subtract(numberOfDaysBefore, this.days);
  }


  /**
   * Get the start date of this week with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentStartDateOfThisWeek(): any {
    return this.getMoment().startOf(this.week);
  }

  /**
   * Get the end date of this week with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentEndDateOfThisWeek(): any {
    return this.getMoment().endOf(this.week);
  }

  /**
   * Get the start date of latest weeks with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestWeeks
   */
  getMomentStartDateOfLatestWeeks(numberOfLatestWeeks: number): any {
    return this.getMoment().subtract(numberOfLatestWeeks, this.week).startOf(this.week);
  }

  /**
   * Get the end date of latest weeks with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestWeeks
   */
  getMomentEndDateOfLatestWeeks(numberOfLatestWeeks: number): any {
    return this.getMoment().subtract(numberOfLatestWeeks, this.week).endOf(this.week);
  }

  /**
   * Get the start date of this month with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentStartDateOfThisMonth(): any {
    return this.getMoment().startOf(this.month);
  }

  /**
   * Get the end date of this month with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentEndDateOfThisMonth(): any {
    return this.getMoment().endOf(this.month);
  }

  /**
   * Get the end date of month which is the month of given date.
   * @return {string} Date of a day in default format.
   * @param date
   */
  getEndDateOfMonthByGivenDate(date: string): string {
    return this.formatDate(this.getMomentDate(date).endOf('month'));
  }

  /**
   * Get the end date of month which is the month of given date and dateFormat.
   * @return {string} Date of a day in default format.
   * @param date
   * @param dateFormat
   */
  getEndDateOfMonthByGivenDateFormat(date: string, dateFormat: string = this.defaultDateFormat): string {
    return this.formatDate(this.getMomentDate(date).endOf('month'), dateFormat);
  }

  /**
   * Get the start date of latest months with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestMonths
   */
  getMomentStartDateOfLatestMonths(numberOfLatestMonths: number): any {
    return this.getMoment().subtract(numberOfLatestMonths, this.month).startOf(this.month);
  }

  /**
   * Get the end date of latest months with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestMonths
   */
  getMomentEndDateOfLatestMonths(numberOfLatestMonths: number): any {
    return this.getMoment().subtract(numberOfLatestMonths, this.month).endOf(this.month);
  }

  /**
   * Get the start date of this year with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentStartDateOfThisYear(): any {
    return this.getMoment().startOf(this.year);
  }

  /**
   * Get the end date of this year with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentEndDateOfThisYear(): any {
    return this.getMoment().endOf(this.year);
  }

  /**
   * Get the start date of latest years with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestYears
   */
  getMomentStartDateOfLatestYears(numberOfLatestYears: number): any {
    return this.getMoment().subtract(numberOfLatestYears, this.year).startOf(this.year);
  }

  /**
   * Get the end date of latest years with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param numberOfLatestYears
   */
  getMomentEndDateOfLatestYears(numberOfLatestYears: number): any {
    return this.getMoment().subtract(numberOfLatestYears, this.year).endOf(this.year);
  }

  /**
   * Get the month n months before in default format.
   * @return {any} Month in default format.
   * @param numberOfMonthsBefore
   */
  getMonthMonthsBefore(numberOfMonthsBefore: number): string {
    return this.formatMonth(this.getMomentStartDateOfLatestMonths(numberOfMonthsBefore));
  }

  /**
   * Get the month of today in default format.
   * @return {any} Month of today in default format.
   */
  getMonthToday(): string {
    return this.formatMonth(this.getMoment());
  }

  /**
   * Get the month of date in specified format.
   * @return {any} Month of date in specified format.
   */
  getMonthOfDateWithFormat(date: string, monthFormat: string): string {
    return this.formatMonth(this.getMomentDate(date), monthFormat);
  }

  /**
   * Get the date of today with type 'moment'.
   * @return {any} Date of today with type 'moment'.
   */
  getMoment(): any {
    return moment();
  }

  /**
   * Get the date of a specified day with type 'moment'.
   * @return {any} Date of a day with type 'moment'.
   * @param date
   */
  getMomentDate(date: string): any {
    return moment(date);
  }

  /**
   * Get the date of a specified day with type 'moment'.
   * @param {string} date the given string date.
   * @param {string} format the given format.
   * @return {any} Date of a day with type 'moment'.
   */
  getMomentDateStringFormat(date: string, format: string): any {
    return moment(date, format);
  }

  /**
   * Return the date of after months by 'numberOfMonthsAfter'.
   * @return {any} Date of after month by 'numberOfMonthsAfter' with type 'moment'.
   * @param numberOfMonthsAfter
   */
  getMomentOfAfterMonths(numberOfMonthsAfter: number): any {
    return this.getMoment().add(numberOfMonthsAfter, this.month);
  }
}
