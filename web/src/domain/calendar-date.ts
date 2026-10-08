export type CalendarDate = string & { readonly __calendarDate: unique symbol };

export interface ExhibitionDates {
	startDate: CalendarDate;
	endDate?: CalendarDate;
}

export function createCalendarDate(value: unknown): CalendarDate | undefined {
	if (typeof value !== 'string') {
		return undefined;
	}

	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) {
		return undefined;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (year < 1 || month < 1 || month > 12 || day < 1) {
		return undefined;
	}

	const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (day > daysInMonth[month - 1]) {
		return undefined;
	}

	return value as CalendarDate;
}

export function createExhibitionDates(
	startDate: unknown,
	endDate?: unknown,
): ExhibitionDates | undefined {
	const validStartDate = createCalendarDate(startDate);
	if (!validStartDate) {
		return undefined;
	}

	if (endDate === undefined) {
		return { startDate: validStartDate };
	}

	const validEndDate = createCalendarDate(endDate);
	if (!validEndDate || validEndDate < validStartDate) {
		return undefined;
	}

	return { startDate: validStartDate, endDate: validEndDate };
}

function isLeapYear(year: number): boolean {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
