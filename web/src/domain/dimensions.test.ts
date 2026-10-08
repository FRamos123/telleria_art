import { describe, expect, it } from 'vitest';
import { createDimensions } from './dimensions';

describe('createDimensions', () => {
	it.each([
		[1, 1],
		[60, 40],
		[0.1, 0.2],
		[60.5, 40.1],
	])('accepts positive dimensions with at most one decimal: %s × %s cm', (heightCm, widthCm) => {
		expect(createDimensions(heightCm, widthCm)).toEqual({ heightCm, widthCm });
	});

	it.each([
		[0, 10],
		[-1, 10],
		[10, 0],
		[10, -1],
		[1.01, 10],
		[10, 1.01],
		[Number.NaN, 10],
		[10, Number.POSITIVE_INFINITY],
		['60', 40],
		[60, '40'],
	])('rejects invalid dimensions: %s × %s cm', (heightCm, widthCm) => {
		expect(createDimensions(heightCm, widthCm)).toBeUndefined();
	});
});
