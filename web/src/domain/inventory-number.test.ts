import { describe, expect, it } from 'vitest';
import { createInventoryNumber } from './inventory-number';

describe('createInventoryNumber', () => {
	const currentYear = 2026;

	it.each([
		'AFT-1900-001',
		'AFT-2026-001',
		'AFT-2026-999',
	])('accepts a valid inventory number: %s', (value) => {
		expect(createInventoryNumber(value, currentYear)).toBe(value);
	});

	it('accepts the current year and final sequence boundary', () => {
		expect(createInventoryNumber('AFT-2026-999', currentYear)).toBe('AFT-2026-999');
	});

	it.each([
		'',
		'AFT-1899-001',
		'AFT-2027-001',
		'AFT-026-001',
		'AFT-2026-000',
		'AFT-2026-1000',
		'aft-2026-001',
		'AFT-2026-01a',
		undefined,
		null,
		2026,
	])('rejects an invalid inventory number: %s', (value) => {
		expect(createInventoryNumber(value, currentYear)).toBeUndefined();
	});
});
