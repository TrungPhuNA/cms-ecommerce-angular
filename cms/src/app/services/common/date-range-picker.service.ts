import {Injectable} from '@angular/core';
import {MomentService} from './moment.service';
import {maximumNumberOfFutureMonths, maxOneYearPeriod, reportMinDate} from "../../shared";

@Injectable({
  providedIn: 'root'
})
export class DateRangePickerService {

  constructor(private momentService: MomentService) {
  }

  /**
   * Generate the date range picker options.
   * @return {any} Date range picker settings
   * @param startDate
   * @param endDate
   * @param maxPeriodDays
   */
  generateOptions(startDate: string, endDate: string, maxPeriodDays: number): any {
    const momentDateToday: any = this.momentService.getMoment();

    return {
      options: {
        autoApply: true,
        startDate: this.momentService.getMomentDate(startDate),
        endDate: this.momentService.getMomentDate(endDate),
        minDate: this.momentService.getMomentDate(reportMinDate),
        maxDate: this.momentService.getMomentOfAfterMonths(maximumNumberOfFutureMonths),
        dateLimit: {
          days: maxPeriodDays
        },
        ranges: {
          "Today": [momentDateToday, momentDateToday],
          "Yesterday": [this.momentService.getMomentDateDaysBefore(1), this.momentService.getMomentDateDaysBefore(1)],
          "Last 7 Days": [this.momentService.getMomentDateDaysBefore(6), momentDateToday],
          "Last 14 Days": [this.momentService.getMomentDateDaysBefore(13), momentDateToday],
          "Last 30 Days": [this.momentService.getMomentDateDaysBefore(29), momentDateToday],
          "This Week": [this.momentService.getMomentStartDateOfThisWeek(), this.momentService.getMomentEndDateOfThisWeek()],
          "Last Week": [this.momentService.getMomentStartDateOfLatestWeeks(1), this.momentService.getMomentEndDateOfLatestWeeks(1)],
          "This Month": [this.momentService.getMomentStartDateOfThisMonth(), this.momentService.getMomentEndDateOfThisMonth()],
          "Last Month": [this.momentService.getMomentStartDateOfLatestMonths(1), this.momentService.getMomentEndDateOfLatestMonths(1)],
        },
        opens: "center",
        buttonClasses: ["btn"],
        format: this.momentService.defaultDateFormat,
        separator: this.momentService.dateRangeSeparator,
        locale: {
          format: this.momentService.longDateFormat
        },
        alwaysShowCalendars: true
      },
      range: this.momentService.generateDateRange(startDate, endDate, this.momentService.longDateFormat)
    };
  }

  /**
   * Generate the month range picker options.
   * @return {any} Date range picker settings
   * @param startDate
   * @param endDate
   */
  generateMonthRangePickerOptions(startDate: string, endDate: string): any {
    let momentDateToday: any = this.momentService.getMoment();

    return {
      options: {
        autoApply: true,
        startDate: this.momentService.getMomentDate(startDate),
        endDate: this.momentService.getMomentDate(endDate),
        minDate: this.momentService.getMomentDate(reportMinDate),
        maxDate: this.momentService.getMomentOfAfterMonths(maximumNumberOfFutureMonths),
        dateLimit: {
          days: maxOneYearPeriod
        },
        ranges: {
          "Last 12 months": [this.momentService.getMomentStartDateOfLatestMonths(11), momentDateToday],
          "This Year": [this.momentService.getMomentStartDateOfThisYear(), momentDateToday],
          "Last Year": [this.momentService.getMomentStartDateOfLatestYears(1), this.momentService.getMomentEndDateOfLatestYears(1)],
        },
        opens: "center",
        buttonClasses: ["btn"],
        format: this.momentService.defaultMonthFormat,
        separator: this.momentService.dateRangeSeparator,
        locale: {
          format: this.momentService.longMonthFormat
        },
        alwaysShowCalendars: false
      },
      range: this.momentService.generateDateRange(startDate, endDate, this.momentService.longMonthFormat)
    };
  }

  /**
   * Generate the date picker options.
   * @param {string} date in format 'YYYY-MM-DD'.
   * @param {number} previousPaymentDateAvailable number of previous date range.
   * @param {number} nextPaymentDateAvailable number of next date range.
   * @param {string} dateFormat locale date format, default is 'YYYY-MM-DD'.
   * @return {any} Date picker settings
   */
  generateDateSinglePickerOptions(
    date: string,
    previousPaymentDateAvailable: number,
    nextPaymentDateAvailable: number,
    dateFormat: string = this.momentService.defaultDateFormat
  ): any {
    const currentDate = this.momentService.getMomentDate(date);
    return {
      options: {
        singleDatePicker: true,
        startDate: currentDate,
        endDate: currentDate,
        minDate: this.momentService.getDateDaysBefore(previousPaymentDateAvailable, dateFormat),
        maxDate: this.momentService.getDateDaysBefore(nextPaymentDateAvailable, dateFormat),
        locale: {
          format: dateFormat
        }
      },
      date: this.momentService.formatDate(currentDate, dateFormat)
    };
  }

  /**
   * Generate the single date picker campaign closure options.
   * @param {string} date in format 'YYYY-MM-DD'.
   * @param {string} dateFormat locale date format, default is 'YYYY-MM-DD'.
   * @return {any} Date picker settings
   */
  generateDateSinglePickerCampaignClosureOptions(
    date: string,
    dateFormat: string = this.momentService.defaultDateFormat
  ): any {
    const currentDate = this.momentService.getMomentDate(date);
    const today = this.momentService.getMoment();
    return {
      options: {
        singleDatePicker: true,
        startDate: currentDate,
        endDate: currentDate,
        minDate: currentDate,
        maxDate: currentDate.month() == today.month() ? this.momentService.getDateDaysBefore(1, dateFormat) : this.momentService.getEndDateOfMonthByGivenDateFormat(date, dateFormat),
        locale: {
          format: dateFormat
        }
      },
      date: this.momentService.formatDate(currentDate, dateFormat)
    };
  }

  /**
   * Generate the month range picker campaign closure options.
   * @param {string} startDate date in format 'YYYY-MM-DD'.
   * @param {string} endDate date in format 'YYYY-MM-DD'.
   * @return {any} Date range picker settings
   */
  generateMonthRangePickerCampaignClosureOptions(startDate: string, endDate: string): any {
    let momentDateToday: any = this.momentService.getMoment();

    return {
      options: {
        autoApply: true,
        startDate: this.momentService.getMomentDate(startDate),
        endDate: this.momentService.getMomentDate(endDate),
        minDate: this.momentService.getMomentDate(reportMinDate),
        maxDate: this.momentService.getMomentOfAfterMonths(0),
        dateLimit: {
          days: maxOneYearPeriod
        },
        ranges: {
          "Last 12 months": [this.momentService.getMomentStartDateOfLatestMonths(11), momentDateToday],
          "This Year": [this.momentService.getMomentStartDateOfThisYear(), momentDateToday],
          "Last Year": [this.momentService.getMomentStartDateOfLatestYears(1), this.momentService.getMomentEndDateOfLatestYears(1)],
        },
        opens: "center",
        buttonClasses: ["btn"],
        format: this.momentService.defaultMonthFormat,
        separator: this.momentService.dateRangeSeparator,
        locale: {
          format: this.momentService.longMonthFormat
        },
        alwaysShowCalendars: false
      },
      range: this.momentService.generateDateRange(startDate, endDate, this.momentService.longMonthFormat)
    };
  }
}
