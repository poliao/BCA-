
import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  override getYearName(date: Date): string {
    const dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
    return this.customformat(dtf, date).replace(/\D/g, '');
  }

  override format(date: Date, displayFormat: Record<string, 'numeric' | '2-digit'>): string {
    if (!this.isValid(date)) throw Error('NativeDateAdapter: Cannot format invalid date.');

    let year = null;
    const customFormat = { ...displayFormat };
    if (customFormat.hasOwnProperty('year')) {
      const yearFormat = customFormat.year;
      delete customFormat.year;
      const ytf = new Intl.DateTimeFormat(this.locale, { year: yearFormat, timeZone: 'utc' });
      year = this.customformat(ytf, date).replace(/\D/g, '');
    }

    const dtf = new Intl.DateTimeFormat(this.locale, { ...customFormat, timeZone: 'utc' });
    return year ? this.customformat(dtf, date) + ' ' + year : this.customformat(dtf, date);
  }

  customformat(dtf: Intl.DateTimeFormat, date: Date): string {
    // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
    // To work around this we use `setUTCFullYear` and `setUTCHours` instead.
    const d = new Date();
    d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return dtf.format(d);
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: '2-digit', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { month: 'long', year: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
}
