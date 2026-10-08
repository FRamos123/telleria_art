import { describe, expect, it } from 'vitest';
import { createCalendarDate, createExhibitionDates } from './calendar-date';

describe('createCalendarDate', () => {
	it.each(['1900-01-01', '2024-02-29', '2026-10-08', '9999-12-31'])(
		'accepts a real calendar date: %s', (value) => {
			expect(createCalendarDate(value)).toBe(value);
		},
	);

	it.each([
		'',
		' 2026-10-08 ',
		'2026-2-08',
		'2026/10/08',
		'2026-00-10',
		'2026-13-10',
		'2026-04-31',
		'2023-02-29',
		'2026-10-08T00:00:00Z',
		undefined,
		null,
		20261008,
	])('rejects an invalid calendar date: %s', (value) => {
		expect(createCalendarDate(value)).toBeUndefined();
	});
});

describe('createExhibitionDates', () => {
	it('requires a valid start date and allows an absent end date', () => {
		expect(createExhibitionDates('2026-10-08')).toEqual({ startDate: '2026-10-08' });
	});

	it.each([undefined, null, '', '2026-02-30', 'not-a-date'])(
		'rejects a missing or invalid start date: %s', (startDate) => {
			expect(createExhibitionDates(startDate)).toBeUndefined();
		},
	);

	it('accepts an end date equal to or later than the start date', () => {
		expect(createExhibitionDates('2024-02-29', '2024-02-29')).toEqual({
			startDate: '2024-02-29',
			endDate: '2024-02-29',
		});
		expect(createExhibitionDates('2024-02-29', '2024-03-01')).toEqual({
			startDate: '2024-02-29',
			endDate: '2024-03-01',
		});
	});

	it.each(['2024-02-28', '2024-02-30', null, 20240301])(
		'rejects an earlier or invalid provided end date: %s', (endDate) => {
			expect(createExhibitionDates('2024-02-29', endDate)).toBeUndefined();
		},
	);
});
