import { describe, expect, it } from 'vitest';
import { checkExhibitionCompleteness, checkSeriesCompleteness } from './completeness';

describe('checkSeriesCompleteness', () => {
	it('accepts a localized name when optional content is absent', () => {
		expect(checkSeriesCompleteness({
			translation: { name: 'Retratos' },
		})).toEqual({ complete: true, errors: [], optional: {} });
	});

	it('accepts a complete English translation independently', () => {
		expect(checkSeriesCompleteness({
			translation: { name: 'Portraits', description: 'A series of portraits.' },
		})).toEqual({
			complete: true,
			errors: [],
			optional: { description: 'A series of portraits.' },
		});
	});

	it.each([undefined, null, '', '   ', 123])(
		'requires a non-empty localized series name: %s', (name) => {
			expect(checkSeriesCompleteness({ translation: { name } }).errors)
				.toContain('translation.name');
		},
	);

	it('trims a valid optional description and retains a valid optional image', () => {
		expect(checkSeriesCompleteness({
			image: { assetId: 'series-image' },
			translation: {
				name: 'Retratos',
				description: '  Retratos de distintas épocas.  ',
				imageAlt: 'Tres retratos pintados en tonos cálidos',
			},
		})).toEqual({
			complete: true,
			errors: [],
			optional: {
				description: 'Retratos de distintas épocas.',
				image: { assetId: 'series-image', altText: 'Tres retratos pintados en tonos cálidos' },
			},
		});
	});

	it.each([
		['asset inexistente', undefined, 'Imagen de la serie'],
		['asset id vacío', { assetId: ' ' }, 'Imagen de la serie'],
		['alt ausente', { assetId: 'series-image' }, undefined],
		['alt vacío', { assetId: 'series-image' }, '  '],
		['alt demasiado largo', { assetId: 'series-image' }, 'a'.repeat(151)],
		['alt igual al nombre', { assetId: 'series-image' }, ' Retratos '],
	])('omits an invalid optional series image (%s) without blocking the series', (_label, image, imageAlt) => {
		const result = checkSeriesCompleteness({
			image,
			translation: { name: 'Retratos', imageAlt },
		});

		expect(result.complete).toBe(true);
		expect(result.optional).not.toHaveProperty('image');
	});

	it('omits empty or malformed optional descriptions without blocking the series', () => {
		for (const description of ['', '  ', null, 42]) {
			const result = checkSeriesCompleteness({ translation: { name: 'Retratos', description } });
			expect(result.complete).toBe(true);
			expect(result.optional).not.toHaveProperty('description');
		}
	});
});

describe('checkExhibitionCompleteness', () => {
	it('accepts required Spanish content, a valid start date, and no optional associations', () => {
		expect(checkExhibitionCompleteness({
			startDate: '2026-05-01',
			translation: { title: 'Muestra colectiva', venue: 'Museo de Arte' },
		})).toEqual({
			complete: true,
			errors: [],
			dates: { startDate: '2026-05-01' },
			optional: {},
		});
	});

	it('accepts a complete English translation and an optional end date', () => {
		expect(checkExhibitionCompleteness({
			startDate: '2026-05-01',
			endDate: '2026-05-31',
			translation: { title: 'Group exhibition', venue: 'Art Museum' },
		})).toEqual({
			complete: true,
			errors: [],
			dates: { startDate: '2026-05-01', endDate: '2026-05-31' },
			optional: {},
		});
	});

	it.each([undefined, null, '', '   '])(
		'treats an empty optional exhibition end date as absent: %s', (endDate) => {
			expect(checkExhibitionCompleteness({
				startDate: '2026-05-01',
				endDate,
				translation: { title: 'Muestra', venue: 'Museo' },
			})).toMatchObject({
				complete: true,
				dates: { startDate: '2026-05-01' },
			});
		},
	);

	it.each([
		[undefined, undefined],
		['2026-02-30', undefined],
		['2026-05-01', '2026-04-30'],
		['2026-05-01', 'not-a-date'],
	])('rejects missing or invalid exhibition dates: %s to %s', (startDate, endDate) => {
		expect(checkExhibitionCompleteness({
			startDate,
			endDate,
			translation: { title: 'Muestra', venue: 'Museo' },
		}).errors).toContain('dates');
	});

	it.each([
		['title vacío', { title: '  ', venue: 'Museo' }, 'translation.title'],
		['venue ausente', { title: 'Muestra', venue: undefined }, 'translation.venue'],
		['title inglés ausente', { title: undefined, venue: 'Art Museum' }, 'translation.title'],
		['venue inglés vacío', { title: 'Exhibition', venue: '' }, 'translation.venue'],
	])('requires localized exhibition title and venue (%s)', (_label, translation, field) => {
		expect(checkExhibitionCompleteness({
			startDate: '2026-05-01',
			translation,
		}).errors).toContain(field);
	});

	it('retains valid optional relations and image with localized alternative text', () => {
		expect(checkExhibitionCompleteness({
			startDate: '2026-05-01',
			image: { assetId: 'exhibition-image' },
			artworkIds: ['artwork-1', 'artwork-2'],
			seriesIds: ['series-1'],
			translation: {
				title: 'Muestra colectiva',
				venue: 'Museo de Arte',
				imageAlt: 'Vista de la sala principal del museo',
			},
		})).toEqual({
			complete: true,
			errors: [],
			dates: { startDate: '2026-05-01' },
			optional: {
				image: { assetId: 'exhibition-image', altText: 'Vista de la sala principal del museo' },
				artworkIds: ['artwork-1', 'artwork-2'],
				seriesIds: ['series-1'],
			},
		});
	});

	it.each([
		['asset inexistente', undefined, 'Vista de la exposición'],
		['asset id vacío', { assetId: '' }, 'Vista de la exposición'],
		['alt ausente', { assetId: 'exhibition-image' }, undefined],
		['alt vacío', { assetId: 'exhibition-image' }, '  '],
		['alt demasiado largo', { assetId: 'exhibition-image' }, 'a'.repeat(151)],
		['alt igual al título', { assetId: 'exhibition-image' }, ' Muestra '],
	])('omits an invalid optional exhibition image (%s) without blocking the exhibition', (_label, image, imageAlt) => {
		const result = checkExhibitionCompleteness({
			startDate: '2026-05-01',
			image,
			translation: { title: 'Muestra', venue: 'Museo', imageAlt },
		});

		expect(result.complete).toBe(true);
		expect(result.optional).not.toHaveProperty('image');
	});

	it('omits malformed optional associations while preserving valid ids', () => {
		const result = checkExhibitionCompleteness({
			startDate: '2026-05-01',
			artworkIds: ['artwork-1', '', null, '  '],
			seriesIds: 'series-1',
			translation: { title: 'Muestra', venue: 'Museo' },
		});

		expect(result.complete).toBe(true);
		expect(result.optional).toEqual({ artworkIds: ['artwork-1'] });
	});
});
