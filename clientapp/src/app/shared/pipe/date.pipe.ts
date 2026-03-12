import { Inject, Optional, Pipe, PipeTransform } from "@angular/core";
import { DATE_PIPE_DEFAULT_OPTIONS, DatePipeConfig } from "@angular/common";

import { I18nService, SupportedLanguages } from "@app/core/services/i18n.service";

const u = undefined;
const localeEn = [
  "en",
  [["a", "p"], ["AM", "PM"], u],
  [["AM", "PM"], u, u],
  [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]],
  u,
  [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]],
  u,
  [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]],
  0,
  [6, 0],
  ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
  ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
  ["{1}, {0}", u, "{1} 'at' {0}", u],
  [".", ",", ";", "%", "+", "-", "E", "×", "‰", "∞", "NaN", ":"],
  ["#,##0.###", "#,##0%", "¤#,##0.00", "#E0"],
  "USD",
  "$",
  "US Dollar",
  {},
  "ltr",
  (val: any) => {
    const i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, '').length;
    if (i === 1 && v === 0) return 1;
    return 5;
  },
];

const localeTh = [
  "th",
  [["a", "p"], ["ก่อนเที่ยง", "หลังเที่ยง"], u],
  [["ก่อนเที่ยง", "หลังเที่ยง"], u, u],
  [["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"], ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."], ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"], ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]],
  u,
  [["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."], u, ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]],
  u,
  [["ก่อน พ.ศ.", "พ.ศ."], u, ["ปีก่อนพุทธกาล", "พุทธศักราช"]],
  0,
  [6, 0],
  ["d/M/yy", "d MMM y", "d MMMM G y", "EEEEที่ d MMMM G y"],
  ["HH:mm", "HH:mm:ss", "H นาฬิกา mm นาที ss วินาที z", "H นาฬิกา mm นาที ss วินาที zzzz"],
  ["{1} {0}", u, u, u],
  [".", ",", ";", "%", "+", "-", "E", "×", "‰", "∞", "NaN", ":"],
  ["#,##0.###", "#,##0%", "¤#,##0.00", "#E0"],
  "THB",
  "฿",
  "บาท",
  { "AUD": ["AU$", "$"], "BYN": [u, "р."], "PHP": [u, "₱"], "THB": ["฿"], "TWD": ["NT$"], "USD": ["US$", "$"], "XXX": [] },
  "ltr",
  (_: any) => {
    /// const n = val;
    return 5;
  },
];

const ISO8601_DATE_REGEX =
  /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
const NAMED_FORMATS: {[localeId: string]: {[format: string]: string}} = {};
const DATE_FORMATS_SPLIT =
  /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;

type Time = {
  hours: number;
  minutes: number;
};
type DateFormatter = (date: Date, locale: string, offset: number) => string;
const DATE_FORMATS: { [format: string]: DateFormatter } = {};

const JANUARY = 0;
const THURSDAY = 4;

/**
 * Index of each type of locale data from the locale data array
 */
enum LocaleDataIndex {
  LocaleId = 0,
  DayPeriodsFormat,
  DayPeriodsStandalone,
  DaysFormat,
  DaysStandalone,
  MonthsFormat,
  MonthsStandalone,
  Eras,
  FirstDayOfWeek,
  WeekendRange,
  DateFormat,
  TimeFormat,
  DateTimeFormat,
  NumberSymbols,
  NumberFormats,
  CurrencyCode,
  CurrencySymbol,
  CurrencyName,
  Currencies,
  Directionality,
  PluralCase,
  ExtraData,
}

/**
 * Index of each type of locale data from the extra locale data array
 */
const enum ExtraLocaleDataIndex {
  ExtraDayPeriodFormats = 0,
  ExtraDayPeriodStandalone,
  ExtraDayPeriodsRules,
}

enum NumberSymbol {
  Decimal,
  Group,
  List,
  PercentSign,
  PlusSign,
  MinusSign,
  Exponential,
  SuperscriptingExponent,
  PerMille,
  InfinitySymbol,
  NaNSymbol,
  TimeSeparator,
  CurrencyDecimal,
  CurrencyGroup
}

enum ZoneWidth {
  Short,
  ShortGMT,
  Long,
  Extended,
}

enum DateType {
  FullYear,
  Month,
  Date,
  Hours,
  Minutes,
  Seconds,
  FractionalSeconds,
  Day,
}

enum TranslationType {
  DayPeriods,
  Days,
  Months,
  Eras,
}

/**
 * String widths available for translations.
 * The specific character widths are locale-specific.
 * Examples are given for the word "Sunday" in English.
 */
enum TranslationWidth {
  /** 1 character for `en-US`. For example: 'S' */
  Narrow,

  /** 3 characters for `en-US`. For example: 'Sun' */
  Abbreviated,

  /** Full length for `en-US`. For example: "Sunday" */
  Wide,

  /** 2 characters for `en-US`, For example: "Su" */
  Short,
}

/**
 * String widths available for date-time formats.
 * The specific character widths are locale-specific.
 * Examples are given for `en-US`.
 */
enum FormatWidth {
  /**
   * For `en-US`, 'M/d/yy, h:mm a'`
   * (Example: `6/15/15, 9:03 AM`)
   */
  Short,

  /**
   * For `en-US`, `'MMM d, y, h:mm:ss a'`
   * (Example: `Jun 15, 2015, 9:03:01 AM`)
   */
  Medium,

  /**
   * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
   * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
   */
  Long,

  /**
   * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
   * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
   */
  Full,
}

/**
 * Context-dependant translation forms for strings.
 * Typically the standalone version is for the nominative form of the word,
 * and the format version is used for the genitive case.
 * @see [CLDR website](http://cldr.unicode.org/translation/date-time-1/date-time#TOC-Standalone-vs.-Format-Styles)
 */
enum FormStyle {
  Format,
  Standalone,
}

const DEFAULT_DATE_FORMAT = 'mediumDate';

@Pipe({ name: 'localeDate', standalone: true })
export class LocalizedDatePipe implements PipeTransform {
  constructor(
    private i18n: I18nService,
    @Inject(DATE_PIPE_DEFAULT_OPTIONS) @Optional() private defaultOptions?: DatePipeConfig | null
  ) {}

  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   * @param format The date/time components to include, using predefined options or a
   * custom format string.  When not provided, the `DatePipe` looks for the value using the
   * `DATE_PIPE_DEFAULT_OPTIONS` injection token (and reads the `dateFormat` property).
   * If the token is not configured, the `mediumDate` is used as a value.
   * @param timezone A timezone offset (such as `'+0430'`), or a standard UTC/GMT, or continental US
   * timezone abbreviation. When not provided, the `DatePipe` looks for the value using the
   * `DATE_PIPE_DEFAULT_OPTIONS` injection token (and reads the `timezone` property). If the token
   * is not configured, the end-user's local system timezone is used as a value.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n-common-locale-id).
   *
   * @see {@link DATE_PIPE_DEFAULT_OPTIONS}
   *
   * @returns A date string in the desired format.
   */
  transform(
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string
  ): string | null {
    if (value == null || value === '' || Number.isNaN(value)) return null;
    try {
      const _format = format ?? this.defaultOptions?.dateFormat ?? DEFAULT_DATE_FORMAT;
      const _timezone = timezone ?? this.defaultOptions?.timezone ?? undefined;
      return this.formatDate(value, _format, this.i18n.language, _timezone);
    } catch (error) {
      return null;
    }
  }

  /**
   * Formats a date according to locale rules.
   *
   * @param value The date to format, as a Date, or a number (milliseconds since UTC epoch)
   * or an [ISO date-time string](https://www.w3.org/TR/NOTE-datetime).
   * @param format The date-time components to include. See `DatePipe` for details.
   * @param locale A locale code for the locale format rules to use.
   * @param timezone The time zone. A time zone offset from GMT (such as `'+0430'`),
   * or a standard UTC/GMT or continental US time zone abbreviation.
   * If not specified, uses host system settings.
   *
   * @returns The formatted date string.
   */
  private formatDate(
    value: string | number | Date,
    format: string,
    locale: string,
    timezone?: string,
  ): string {
    let date = this.toDate(value);
    if (date === null) return '';

    const namedFormat = this.getNamedFormat(locale, format);
    format = namedFormat ?? format;

    let parts: string[] = [];
    let match: string[];
    while (format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = parts.concat(match.slice(1));
        const part = parts.pop();
        if (!part) break;
        format = part;
      } else {
        parts.push(format);
        break;
      }
    }

    let dateTimezoneOffset = date.getTimezoneOffset();
    if (timezone) {
      dateTimezoneOffset = this.timezoneToOffset(timezone, dateTimezoneOffset);
      date = this.convertTimezoneToLocal(date, timezone, true);
    }

    let text = '';
    parts.forEach(value => {
      const dateFormatter = this.getDateFormatter(value);
      text += dateFormatter
        ? dateFormatter(date, locale, dateTimezoneOffset)
        : value === "''"
        ? "'"
        : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
    });

    return text;
  }

  private getNamedFormat(locale: string, format: string): string {
    const localeId = locale;
    NAMED_FORMATS[localeId] ??= {};

    if (NAMED_FORMATS[localeId][format])
      return NAMED_FORMATS[localeId][format];

    let formatValue: string;
    switch (format) {
      case 'shortDate':
        formatValue = this.getLocaleDateFormat(locale, FormatWidth.Short);
        break;
      case 'mediumDate':
        formatValue = this.getLocaleDateFormat(locale, FormatWidth.Medium);
        break;
      case 'longDate':
        formatValue = this.getLocaleDateFormat(locale, FormatWidth.Long);
        break;
      case 'fullDate':
        formatValue = this.getLocaleDateFormat(locale, FormatWidth.Full);
        break;
      case 'shortTime':
        formatValue = this.getLocaleTimeFormat(locale, FormatWidth.Short);
        break;
      case 'mediumTime':
        formatValue = this.getLocaleTimeFormat(locale, FormatWidth.Medium);
        break;
      case 'longTime':
        formatValue = this.getLocaleTimeFormat(locale, FormatWidth.Long);
        break;
      case 'fullTime':
        formatValue = this.getLocaleTimeFormat(locale, FormatWidth.Full);
        break;
      case 'short': {
        const shortTime = this.getNamedFormat(locale, 'shortTime');
        const shortDate = this.getNamedFormat(locale, 'shortDate');
        formatValue = this.formatDateTime(this.getLocaleDateTimeFormat(locale, FormatWidth.Short), [shortTime, shortDate]);
        break;
      }
      case 'medium': {
        const mediumTime = this.getNamedFormat(locale, 'mediumTime');
        const mediumDate = this.getNamedFormat(locale, 'mediumDate');
        formatValue = this.formatDateTime(this.getLocaleDateTimeFormat(locale, FormatWidth.Medium), [mediumTime, mediumDate]);
        break;
      }
      case 'long': {
        const longTime = this.getNamedFormat(locale, 'longTime');
        const longDate = this.getNamedFormat(locale, 'longDate');
        formatValue = this.formatDateTime(this.getLocaleDateTimeFormat(locale, FormatWidth.Long), [longTime, longDate]);
        break;
      }
      case 'full': {
        const fullTime = this.getNamedFormat(locale, 'fullTime');
        const fullDate = this.getNamedFormat(locale, 'fullDate');
        formatValue = this.formatDateTime(this.getLocaleDateTimeFormat(locale, FormatWidth.Full), [fullTime, fullDate]);
        break;
      }
    }

    if (formatValue) NAMED_FORMATS[localeId][format] = formatValue;
    return formatValue;
  }

  /**
   * Retrieves a localized date-value formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   */
  private getLocaleDateFormat(locale: string, width: FormatWidth): string {
    const data = this.findLocaleData(locale);
    return this.getLastDefinedValue(data[LocaleDataIndex.DateFormat], width);
  }

  /**
   * Retrieves a localized time-value formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   */
  private getLocaleTimeFormat(locale: string, width: FormatWidth): string {
    const data = this.findLocaleData(locale);
    return this.getLastDefinedValue(data[LocaleDataIndex.TimeFormat], width);
  }

  /**
   * Retrieves a localized date-time formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   */
  private getLocaleDateTimeFormat(locale: string, width: FormatWidth): string {
    const data = this.findLocaleData(locale);
    const dateTimeFormatData = <string[]>data[LocaleDataIndex.DateTimeFormat];
    return this.getLastDefinedValue(dateTimeFormatData, width);
  }

  /**
   * Finds the locale data for a given locale.
   *
   * @param locale The locale code.
   * @returns The locale data.
   */
  private findLocaleData(locale: string): any {
    const normalizedLocale = this.normalizeLocale(locale);
    return normalizedLocale.includes(SupportedLanguages.Thai) ? localeTh : localeEn;
  }

  /**
   * Returns the canonical form of a locale name - lowercase with `_` replaced with `-`.
   */
  private normalizeLocale(locale: string): string {
    return locale.toLowerCase().replace(/_/g, '-');
  }

  private getLastDefinedValue<T>(data: T[], index: number): T {
    for (let i = index; i > -1; i--) {
      if (typeof data[i] !== 'undefined') return data[i];
    }
    throw new Error('Locale data API: locale data undefined');
  }

  private formatDateTime(str: string, opt_values: string[]): string {
    if (opt_values) {
      str = str.replace(
        /\{([^}]+)}/g,
        (match, key) => opt_values != null && key in opt_values
          ? opt_values[key]
          : match);
    }
    return str;
  }

  private padNumber(
    num: number,
    digits: number,
    minusSign = '-',
    trim?: boolean,
    negWrap?: boolean,
  ): string {
    let neg = '';
    if (num < 0 || (negWrap && num <= 0)) {
      if (negWrap)
        num = -num + 1;
      else {
        num = -num;
        neg = minusSign;
      }
    }

    let strNum = String(num);
    while (strNum.length < digits)
      strNum = '0' + strNum;

    if (trim)
      strNum = strNum.substring(strNum.length - digits);

    return neg + strNum;
  }

  private formatFractionalSeconds(milliseconds: number, digits: number): string {
    const strMs = this.padNumber(milliseconds, 3);
    return strMs.substring(0, digits);
  }

  /**
   * Returns a date formatter that transforms a date into its locale digit representation
   */
  private dateGetter(
    name: DateType,
    size: number,
    offset: number = 0,
    trim = false,
    negWrap = false,
  ): DateFormatter {
    return (date: Date, locale: string): string => {
      let part = this.getDatePart(name, date);
      if (offset > 0 || part > -offset)
        part += offset;

      if (name === DateType.Hours) {
        if (part === 0 && offset === -12)
          part = 12;
      }
      else if (name === DateType.FractionalSeconds)
        return this.formatFractionalSeconds(part, size);

      const localeMinus = this.getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
      return this.padNumber(part, size, localeMinus, trim, negWrap);
    };
  }

  private getLocaleNumberSymbol(locale: string, symbol: NumberSymbol): string {
    const data = this.findLocaleData(locale);
    const res = data[LocaleDataIndex.NumberSymbols][symbol];
    if (typeof res === 'undefined') {
      if (symbol === NumberSymbol.CurrencyDecimal)
        return data[LocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
      else if (symbol === NumberSymbol.CurrencyGroup)
        return data[LocaleDataIndex.NumberSymbols][NumberSymbol.Group];
    }
    return res;
  }

  private getDatePart(part: DateType, date: Date): number {
    switch (part) {
      case DateType.FullYear:
        return (this.i18n.language === SupportedLanguages.Thai)
          ? (date.getFullYear() + 543)
          : date.getFullYear();
      case DateType.Month:
        return date.getMonth();
      case DateType.Date:
        return date.getDate();
      case DateType.Hours:
        return date.getHours();
      case DateType.Minutes:
        return date.getMinutes();
      case DateType.Seconds:
        return date.getSeconds();
      case DateType.FractionalSeconds:
        return date.getMilliseconds();
      case DateType.Day:
        return date.getDay();
      default:
        throw new Error(`Unknown DateType value "${part}".`);
    }
  }

  private dateStrGetter(
    name: TranslationType,
    width: TranslationWidth,
    form: FormStyle = FormStyle.Format,
    extended = false,
  ): DateFormatter {
    return (date: Date, locale: string): string => this.getDateTranslation(date, locale, name, width, form, extended);
  }

  private getDateTranslation(
    date: Date,
    locale: string,
    name: TranslationType,
    width: TranslationWidth,
    form: FormStyle,
    extended: boolean,
  ) {
    switch (name) {
      case TranslationType.Months:
        return this.getLocaleMonthNames(locale, form, width)[date.getMonth()];
      case TranslationType.Days:
        return this.getLocaleDayNames(locale, form, width)[date.getDay()];
      case TranslationType.DayPeriods: {
        const currentHours = date.getHours();
        const currentMinutes = date.getMinutes();
        if (extended) {
          const rules = this.getLocaleExtraDayPeriodRules(locale);
          const dayPeriods = this.getLocaleExtraDayPeriods(locale, form, width);
          const index = rules.findIndex(rule => {
            if (Array.isArray(rule)) {
              // morning, afternoon, evening, night
              const [from, to] = rule;
              const afterFrom = currentHours >= from.hours && currentMinutes >= from.minutes;
              const beforeTo =
                currentHours < to.hours || (currentHours === to.hours && currentMinutes < to.minutes);
              // We must account for normal rules that span a period during the day (e.g. 6am-9am)
              // where `from` is less (earlier) than `to`. But also rules that span midnight (e.g.
              // 10pm - 5am) where `from` is greater (later!) than `to`.
              //
              // In the first case the current time must be BOTH after `from` AND before `to`
              // (e.g. 8am is after 6am AND before 10am).
              //
              // In the second case the current time must be EITHER after `from` OR before `to`
              // (e.g. 4am is before 5am but not after 10pm; and 11pm is not before 5am but it is
              // after 10pm).
              if (from.hours < to.hours) {
                if (afterFrom && beforeTo)
                  return true;
              } else if (afterFrom || beforeTo)
                return true;
            } else if (rule.hours === currentHours && rule.minutes === currentMinutes)
              return true;
            return false;
          });
          if (index !== -1) return dayPeriods[index];
        }

        // if no rules for the day periods, we use am/pm by default
        return this.getLocaleDayPeriods(locale, form, <TranslationWidth>width)[currentHours < 12 ? 0 : 1];
      }
      case TranslationType.Eras:
        return this.getLocaleEraNames(locale, <TranslationWidth>width)[date.getFullYear() <= 0 ? 0 : 1];
      default: {
        // This default case is not needed by TypeScript compiler, as the switch is exhaustive.
        // However Closure Compiler does not understand that and reports an error in typed mode.
        // The `throw new Error` below works around the problem, and the unexpected: never variable
        // makes sure tsc still checks this code is unreachable.
        const unexpected: never = name;
        throw new Error(`unexpected translation type ${unexpected}`);
      }
    }
  }

  /**
   * Retrieves day period strings for the given locale.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized period strings. For example, `[AM, PM]` for `en-US`.
   */
  private getLocaleDayPeriods(
    locale: string,
    formStyle: FormStyle,
    width: TranslationWidth,
  ): Readonly<[string, string]> {
    const data = this.findLocaleData(locale);
    const amPmData = <[string, string][][]>[
      data[LocaleDataIndex.DayPeriodsFormat],
      data[LocaleDataIndex.DayPeriodsStandalone],
    ];
    const amPm = this.getLastDefinedValue(amPmData, formStyle);
    return this.getLastDefinedValue(amPm, width);
  }

  /**
   * Retrieves days of the week for the given locale, using the Gregorian calendar.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized name strings.
   * For example,`[Sunday, Monday, ... Saturday]` for `en-US`.
   */
  private getLocaleDayNames(
    locale: string,
    formStyle: FormStyle,
    width: TranslationWidth,
  ): ReadonlyArray<string> {
    const data = this.findLocaleData(locale);
    const daysData = <string[][][]>[
      data[LocaleDataIndex.DaysFormat],
      data[LocaleDataIndex.DaysStandalone],
    ];
    const days = this.getLastDefinedValue(daysData, formStyle);
    return this.getLastDefinedValue(days, width);
  }

  /**
   * Retrieves months of the year for the given locale, using the Gregorian calendar.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized name strings.
   * For example,  `[January, February, ...]` for `en-US`.
   */
  private getLocaleMonthNames(
    locale: string,
    formStyle: FormStyle,
    width: TranslationWidth,
  ): ReadonlyArray<string> {
    const data = this.findLocaleData(locale);
    const monthsData = <string[][][]>[
      data[LocaleDataIndex.MonthsFormat],
      data[LocaleDataIndex.MonthsStandalone],
    ];
    const months = this.getLastDefinedValue(monthsData, formStyle);
    return this.getLastDefinedValue(months, width);
  }

  /**
   * Retrieves Gregorian-calendar eras for the given locale.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The required character width.
   * @returns An array of localized era strings.
   * For example, `[AD, BC]` for `en-US`.
   */
  private getLocaleEraNames(
    locale: string,
    width: TranslationWidth,
  ): Readonly<[string, string]> {
    const data = this.findLocaleData(locale);
    const erasData = <[string, string][]>data[LocaleDataIndex.Eras];
    return this.getLastDefinedValue(erasData, width);
  }

  /**
   * Retrieves locale-specific rules used to determine which day period to use
   * when more than one period is defined for a locale.
   *
   * There is a rule for each defined day period. The
   * first rule is applied to the first day period and so on.
   * Fall back to AM/PM when no rules are available.
   *
   * A rule can specify a period as time range, or as a single time value.
   *
   * This functionality is only available when you have loaded the full locale data.
   * See the ["I18n guide"](guide/i18n-common-format-data-locale).
   *
   * @param locale A locale code for the locale format rules to use.
   * @returns The rules for the locale, a single time value or array of *from-time, to-time*,
   * or null if no periods are available.
   */
  private getLocaleExtraDayPeriodRules(locale: string): (Time | [Time, Time])[] {
    const data = this.findLocaleData(locale);
    this.checkFullData(data);
    const rules = data[LocaleDataIndex.ExtraData][ExtraLocaleDataIndex.ExtraDayPeriodsRules] || [];
    return rules.map((rule: string|[string, string]) => {
      if (typeof rule === 'string')
        return this.extractTime(rule);
      return [
        this.extractTime(rule[0]),
        this.extractTime(rule[1]),
      ];
    });
  }

  /**
   * Retrieves locale-specific day periods, which indicate roughly how a day is broken up
   * in different languages.
   * For example, for `en-US`, periods are morning, noon, afternoon, evening, and midnight.
   *
   * This functionality is only available when you have loaded the full locale data.
   * See the ["I18n guide"](guide/i18n-common-format-data-locale).
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns The translated day-period strings.
   */
  private getLocaleExtraDayPeriods(
    locale: string,
    formStyle: FormStyle,
    width: TranslationWidth,
  ): string[] {
    const data = this.findLocaleData(locale);
    this.checkFullData(data);
    const dayPeriodsData = <string[][][]>[
      data[LocaleDataIndex.ExtraData][ExtraLocaleDataIndex.ExtraDayPeriodFormats],
      data[LocaleDataIndex.ExtraData][ExtraLocaleDataIndex.ExtraDayPeriodStandalone],
    ];
    const dayPeriods = this.getLastDefinedValue(dayPeriodsData, formStyle) || [];
    return this.getLastDefinedValue(dayPeriods, width) || [];
  }

  private checkFullData(data: any) {
    if (!data[LocaleDataIndex.ExtraData])
      throw new Error(
        `Missing extra locale data for the locale "${
          data[LocaleDataIndex.LocaleId]
        }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`,
      );
  }

  /**
   * Extracts the hours and minutes from a string like "15:45"
   */
  private extractTime(time: string): Time {
    const [ h, m ] = time.split(':');
    return { hours: +h, minutes: +m };
  }

  /**
   * Returns a date formatter that transforms a date and an offset into a timezone with ISO8601 or
   * GMT format depending on the width (eg: short = +0430, short:GMT = GMT+4, long = GMT+04:30,
   * extended = +04:30)
   */
  private timeZoneGetter(width: ZoneWidth): DateFormatter {
    return (_: Date, locale: string, offset: number) => {
      const zone = -1 * offset;
      const minusSign = this.getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
      const hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);
      switch (width) {
        case ZoneWidth.Short:
          return (
            (zone >= 0 ? '+' : '') +
            this.padNumber(hours, 2, minusSign) +
            this.padNumber(Math.abs(zone % 60), 2, minusSign)
          );
        case ZoneWidth.ShortGMT:
          return 'GMT' + ((zone >= 0) ? '+' : '') + this.padNumber(hours, 1, minusSign);
        case ZoneWidth.Long:
          return (
            'GMT' +
            (zone >= 0 ? '+' : '') +
            this.padNumber(hours, 2, minusSign) +
            ':' +
            this.padNumber(Math.abs(zone % 60), 2, minusSign)
          );
        case ZoneWidth.Extended:
          if (offset === 0)
            return 'Z';
          else return (
            (zone >= 0 ? '+' : '') +
            this.padNumber(hours, 2, minusSign) +
            ':' +
            this.padNumber(Math.abs(zone % 60), 2, minusSign)
          );
        default:
          throw new Error(`Unknown zone width "${width}"`);
      }
    };
  }

  private getFirstThursdayOfYear(year: number): Date {
    const firstDayOfYear = this.createDate(year, JANUARY, 1).getDay();
    return this.createDate(
      year,
      0,
      1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear,
    );
  }

  /**
   *  ISO Week starts on day 1 (Monday) and ends with day 0 (Sunday)
   */
  private getThursdayThisIsoWeek(datetime: Date): Date {
    // getDay returns 0-6 range with sunday as 0.
    const currentDay = datetime.getDay();

    // On a Sunday, read the previous Thursday since ISO weeks start on Monday.
    const deltaToThursday = currentDay === 0 ? -3 : THURSDAY - currentDay;

    return this.createDate(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate() + deltaToThursday,
    );
  }

  /**
   * Returns a date formatter that provides the week-numbering year for the input date.
   */
  private weekGetter(size: number, monthBased = false): DateFormatter {
    return (date: Date, locale: string) => {
      let result: number;
      if (monthBased) {
        const nbDaysBefore1stDayOfMonth =
          new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
        const today = date.getDate();
        result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
      } else {
        const thisThurs = this.getThursdayThisIsoWeek(date);
        // Some days of a year are part of next year according to ISO 8601.
        // Compute the firstThurs from the year of this week's Thursday
        const firstThurs = this.getFirstThursdayOfYear(thisThurs.getFullYear());
        const diff = thisThurs.getTime() - firstThurs.getTime();
        result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
      }
      return this.padNumber(result, size, this.getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    };
  }

  /**
   * Returns a date formatter that provides the week-numbering year for the input date.
   */
  private weekNumberingYearGetter(size: number, trim = false): DateFormatter {
    return (date: Date, locale: string) => {
      const thisThurs = this.getThursdayThisIsoWeek(date);
      const weekNumberingYear = thisThurs.getFullYear();
      return this.padNumber(
        weekNumberingYear,
        size,
        this.getLocaleNumberSymbol(locale, NumberSymbol.MinusSign),
        trim,
      );
    };
  }

  // Based on CLDR formats:
  // See complete list: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
  // See also explanations: http://cldr.unicode.org/translation/date-time
  private getDateFormatter(format: string): DateFormatter | null {
    if (DATE_FORMATS[format]) return DATE_FORMATS[format];

    let formatter: DateFormatter;
    switch (format) {
      // Era name (AD/BC)
      case 'G':
      case 'GG':
      case 'GGG':
        formatter = this.dateStrGetter(TranslationType.Eras, TranslationWidth.Abbreviated);
        break;
      case 'GGGG':
        formatter = this.dateStrGetter(TranslationType.Eras, TranslationWidth.Wide);
        break;
      case 'GGGGG':
        formatter = this.dateStrGetter(TranslationType.Eras, TranslationWidth.Narrow);
        break;

        // 1 digit representation of the year, e.g. (AD 1 => 1, AD 199 => 199)
        case 'y':
          formatter = this.dateGetter(DateType.FullYear, 1, 0, false, true);
          break;
        // 2 digit representation of the year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
        case 'yy':
          formatter = this.dateGetter(DateType.FullYear, 2, 0, true, true);
          break;
        // 3 digit representation of the year, padded (000-999). (e.g. AD 2001 => 01, AD 2010 => 10)
        case 'yyy':
          formatter = this.dateGetter(DateType.FullYear, 3, 0, false, true);
          break;
        // 4 digit representation of the year (e.g. AD 1 => 0001, AD 2010 => 2010)
        case 'yyyy':
          formatter = this.dateGetter(DateType.FullYear, 4, 0, false, true);
          break;

        // 1 digit representation of the week-numbering year, e.g. (AD 1 => 1, AD 199 => 199)
        case 'Y':
          formatter = this.weekNumberingYearGetter(1);
          break;
        // 2 digit representation of the week-numbering year, padded (00-99). (e.g. AD 2001 => 01, AD
        // 2010 => 10)
        case 'YY':
          formatter = this.weekNumberingYearGetter(2, true);
          break;
        // 3 digit representation of the week-numbering year, padded (000-999). (e.g. AD 1 => 001, AD
        // 2010 => 2010)
        case 'YYY':
          formatter = this.weekNumberingYearGetter(3);
          break;
        // 4 digit representation of the week-numbering year (e.g. AD 1 => 0001, AD 2010 => 2010)
        case 'YYYY':
          formatter = this.weekNumberingYearGetter(4);
          break;

        // Month of the year (1-12), numeric
        case 'M':
        case 'L':
          formatter = this.dateGetter(DateType.Month, 1, 1);
          break;
        case 'MM':
        case 'LL':
          formatter = this.dateGetter(DateType.Month, 2, 1);
          break;

        // Month of the year (January, ...), string, format
        case 'MMM':
          formatter = this.dateStrGetter(TranslationType.Months, TranslationWidth.Abbreviated);
          break;
        case 'MMMM':
          formatter = this.dateStrGetter(TranslationType.Months, TranslationWidth.Wide);
          break;
        case 'MMMMM':
          formatter = this.dateStrGetter(TranslationType.Months, TranslationWidth.Narrow);
          break;

        // Month of the year (January, ...), string, standalone
        case 'LLL':
          formatter = this.dateStrGetter(
            TranslationType.Months,
            TranslationWidth.Abbreviated,
            FormStyle.Standalone,
          );
          break;
        case 'LLLL':
          formatter = this.dateStrGetter(
            TranslationType.Months,
            TranslationWidth.Wide,
            FormStyle.Standalone,
          );
          break;
        case 'LLLLL':
          formatter = this.dateStrGetter(
            TranslationType.Months,
            TranslationWidth.Narrow,
            FormStyle.Standalone,
          );
          break;

        // Week of the year (1, ... 52)
        case 'w':
          formatter = this.weekGetter(1);
          break;
        case 'ww':
          formatter = this.weekGetter(2);
          break;

        // Week of the month (1, ...)
        case 'W':
          formatter = this.weekGetter(1, true);
          break;

        // Day of the month (1-31)
        case 'd':
          formatter = this.dateGetter(DateType.Date, 1);
          break;
        case 'dd':
          formatter = this.dateGetter(DateType.Date, 2);
          break;

        // Day of the Week StandAlone (1, 1, Mon, Monday, M, Mo)
        case 'c':
        case 'cc':
          formatter = this.dateGetter(DateType.Day, 1);
          break;
        case 'ccc':
          formatter = this.dateStrGetter(
            TranslationType.Days,
            TranslationWidth.Abbreviated,
            FormStyle.Standalone,
          );
          break;
        case 'cccc':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Wide, FormStyle.Standalone);
          break;
        case 'ccccc':
          formatter = this.dateStrGetter(
            TranslationType.Days,
            TranslationWidth.Narrow,
            FormStyle.Standalone,
          );
          break;
        case 'cccccc':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Short, FormStyle.Standalone);
          break;

        // Day of the Week
        case 'E':
        case 'EE':
        case 'EEE':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Abbreviated);
          break;
        case 'EEEE':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Wide);
          break;
        case 'EEEEE':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Narrow);
          break;
        case 'EEEEEE':
          formatter = this.dateStrGetter(TranslationType.Days, TranslationWidth.Short);
          break;

        // Generic period of the day (am-pm)
        case 'a':
        case 'aa':
        case 'aaa':
          formatter = this.dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated);
          break;
        case 'aaaa':
          formatter = this.dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide);
          break;
        case 'aaaaa':
          formatter = this.dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow);
          break;

        // Extended period of the day (midnight, at night, ...), standalone
        case 'b':
        case 'bb':
        case 'bbb':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Abbreviated,
            FormStyle.Standalone,
            true,
          );
          break;
        case 'bbbb':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Wide,
            FormStyle.Standalone,
            true,
          );
          break;
        case 'bbbbb':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Narrow,
            FormStyle.Standalone,
            true,
          );
          break;

        // Extended period of the day (midnight, night, ...), standalone
        case 'B':
        case 'BB':
        case 'BBB':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Abbreviated,
            FormStyle.Format,
            true,
          );
          break;
        case 'BBBB':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Wide,
            FormStyle.Format,
            true,
          );
          break;
        case 'BBBBB':
          formatter = this.dateStrGetter(
            TranslationType.DayPeriods,
            TranslationWidth.Narrow,
            FormStyle.Format,
            true,
          );
          break;

        // Hour in AM/PM, (1-12)
        case 'h':
          formatter = this.dateGetter(DateType.Hours, 1, -12);
          break;
        case 'hh':
          formatter = this.dateGetter(DateType.Hours, 2, -12);
          break;

        // Hour of the day (0-23)
        case 'H':
          formatter = this.dateGetter(DateType.Hours, 1);
          break;
        // Hour in day, padded (00-23)
        case 'HH':
          formatter = this.dateGetter(DateType.Hours, 2);
          break;

        // Minute of the hour (0-59)
        case 'm':
          formatter = this.dateGetter(DateType.Minutes, 1);
          break;
        case 'mm':
          formatter = this.dateGetter(DateType.Minutes, 2);
          break;

        // Second of the minute (0-59)
        case 's':
          formatter = this.dateGetter(DateType.Seconds, 1);
          break;
        case 'ss':
          formatter = this.dateGetter(DateType.Seconds, 2);
          break;

        // Fractional second
        case 'S':
          formatter = this.dateGetter(DateType.FractionalSeconds, 1);
          break;
        case 'SS':
          formatter = this.dateGetter(DateType.FractionalSeconds, 2);
          break;
        case 'SSS':
          formatter = this.dateGetter(DateType.FractionalSeconds, 3);
          break;

        // Timezone ISO8601 short format (-0430)
        case 'Z':
        case 'ZZ':
        case 'ZZZ':
          formatter = this.timeZoneGetter(ZoneWidth.Short);
          break;
        // Timezone ISO8601 extended format (-04:30)
        case 'ZZZZZ':
          formatter = this.timeZoneGetter(ZoneWidth.Extended);
          break;

        // Timezone GMT short format (GMT+4)
        case 'O':
        case 'OO':
        case 'OOO':
        // Should be location, but fallback to format O instead because we don't have the data yet
        case 'z':
        case 'zz':
        case 'zzz':
          formatter = this.timeZoneGetter(ZoneWidth.ShortGMT);
          break;
        // Timezone GMT long format (GMT+0430)
        case 'OOOO':
        case 'ZZZZ':
        // Should be location, but fallback to format O instead because we don't have the data yet
        case 'zzzz':
          formatter = this.timeZoneGetter(ZoneWidth.Long);
          break;
        default:
          return null;
    }
    DATE_FORMATS[format] = formatter;
    return formatter;
  }

  private timezoneToOffset(timezone: string, fallback: number): number {
    // Support: IE 11 only, Edge 13-15+
    // IE/Edge do not "understand" colon (`:`) in timezone
    timezone = timezone.replace(/:/g, '');
    const requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
    return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }

  private addDateMinutes(date: Date, minutes: number) {
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  private convertTimezoneToLocal(date: Date, timezone: string, reverse: boolean): Date {
    const reverseValue = reverse ? -1 : 1;
    const dateTimezoneOffset = date.getTimezoneOffset();
    const timezoneOffset = this.timezoneToOffset(timezone, dateTimezoneOffset);
    return this.addDateMinutes(date, reverseValue * (timezoneOffset - dateTimezoneOffset));
  }

  /**
   * Converts a value to date.
   *
   * Supported input formats:
   * - `Date`
   * - number: timestamp
   * - string: numeric (e.g. "1234"), ISO and date strings in a format supported by
   *   [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   *   Note: ISO strings without time return a date without timeoffset.
   *
   * Throws if unable to convert to a date.
   */
  private toDate(value: any): Date {
    if (this.isDate(value)) return value;
    if (typeof value === 'number' && !isNaN(value))
      return new Date(value);

    if (typeof value === 'string') {
      value = value.trim();
      if (/^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(value)) {
        /*
          For ISO Strings without time the day, month and year must be extracted from the ISO String
          before Date creation to avoid time offset and errors in the new Date.
          If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
          date, some browsers (e.g. IE 9) will throw an invalid Date error.
          If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
          is applied.
          Note: ISO months are 0 for January, 1 for February, ...
        */
        const [y, m = 1, d = 1] = value.split('-').map((val: string | number) => +val);
        return this.createDate(y, m - 1, d);
      }

      const parsedNb = parseFloat(value);

      // any string that only contains numbers, like "1234" but not like "1234hello"
      if (!isNaN((value as any) - parsedNb)) return new Date(parsedNb);

      let match: RegExpMatchArray | null;
      if ((match = value.match(ISO8601_DATE_REGEX)))
        return this.isoStringToDate(match);
    }
    const date = new Date(value as any);
    if (!this.isDate(date)) return null;
    return date;
  }

  private createDate(year: number, month: number, date: number): Date {
    // The `newDate` is set to midnight (UTC) on January 1st 1970.
    // - In PST this will be December 31st 1969 at 4pm.
    // - In GMT this will be January 1st 1970 at 1am.
    // Note that they even have different years, dates and months!
    const newDate = new Date(0);

    // `setFullYear()` allows years like 0001 to be set correctly. This function does not
    // change the internal time of the date.
    // Consider calling `setFullYear(2019, 8, 20)` (September 20, 2019).
    // - In PST this will now be September 20, 2019 at 4pm
    // - In GMT this will now be September 20, 2019 at 1am
    newDate.setFullYear(year, month, date);

    // We want the final date to be at local midnight, so we reset the time.
    // - In PST this will now be September 20, 2019 at 12am
    // - In GMT this will now be September 20, 2019 at 12am
    newDate.setHours(0, 0, 0);
    return newDate;
  }

  /**
   * Converts a date in ISO8601 to a Date.
   * Used instead of `Date.parse` because of browser discrepancies.
   */
  private isoStringToDate(match: RegExpMatchArray): Date {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;

    // match[8] means that the string contains "Z" (UTC) or a timezone like "+01:00" or "+0100"
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;

    // if there is a timezone defined like "+01:00" or "+0100"
    if (match[9]) {
      tzHour = Number(match[9] + match[10]);
      tzMin = Number(match[9] + match[11]);
    }

    dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const h = Number(match[4] || 0) - tzHour;
    const m = Number(match[5] || 0) - tzMin;
    const s = Number(match[6] || 0);

    // The ECMAScript specification (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.11)
    // defines that `DateTime` milliseconds should always be rounded down, so that `999.9ms`
    // becomes `999ms`.
    const ms = Math.floor(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
  }

  private isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
  }
}
