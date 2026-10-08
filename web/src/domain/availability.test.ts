import { describe, expect, it } from 'vitest';
import { AVAILABILITY_VALUES, isAvailability } from './availability';

describe('isAvailability', () => {
	it('exposes the canonical values for editor controls', () => {
		expect(AVAILABILITY_VALUES).toEqual(['disponible', 'reservada', 'vendida', 'en colección']);
	});

	it.each(['disponible', 'reservada', 'vendida', 'en colección'])(
		'accepts the allowed state %s',
		(value) => {
			expect(isAvailability(value)).toBe(true);
		},
	);

	it.each([
		'',
		'disponible ',
		'Available',
		'no disponible',
		'colección',
		undefined,
		null,
		1,
	])('rejects the invalid state %s', (value) => {
		expect(isAvailability(value)).toBe(false);
	});
});
