import { describe, expect, it } from 'vitest';
import { checkArtworkCompleteness, isValidAlternativeText } from './completeness';

const validArtwork = {
	seriesId: 'series-1',
	mainImage: { assetId: 'image-1' },
	year: 2024,
	heightCm: 60,
	widthCm: 40.5,
	inventoryNumber: 'AFT-2023-018',
	availability: 'disponible',
	translation: {
		title: 'Figura',
		technique: 'Óleo',
		support: 'Lienzo',
		altText: 'Figura de pie ante un fondo oscuro',
	},
};

describe('isValidAlternativeText', () => {
	it('validates normalized text against a localized title', () => {
		expect(isValidAlternativeText(' Descripción ', 'Obra')).toBe(true);
		expect(isValidAlternativeText(' Obra ', 'Obra ')).toBe(false);
		expect(isValidAlternativeText('🎨'.repeat(150), 'Obra')).toBe(true);
		expect(isValidAlternativeText('🎨'.repeat(151), 'Obra')).toBe(false);
		expect(isValidAlternativeText('  ', 'Obra')).toBe(false);
	});
});

describe('checkArtworkCompleteness', () => {
	const currentYear = 2026;

	it('accepts a complete artwork version and leaves absent optional fields absent', () => {
		expect(checkArtworkCompleteness(validArtwork, currentYear)).toEqual({
			complete: true,
			errors: [],
			optional: {},
		});
	});

	it('requires all shared and localized artwork fields', () => {
		const result = checkArtworkCompleteness({
			...validArtwork,
			seriesId: '  ',
			mainImage: undefined,
			year: undefined,
			heightCm: undefined,
			widthCm: undefined,
			inventoryNumber: undefined,
			availability: undefined,
			translation: { title: ' ', technique: '', support: undefined, altText: '' },
		}, currentYear);

		expect(result.complete).toBe(false);
		expect(result.errors).toEqual(expect.arrayContaining([
			'seriesId', 'mainImage', 'year', 'dimensions', 'inventoryNumber', 'availability',
			'translation.title', 'translation.technique', 'translation.support', 'translation.altText',
		]));
	});

	it.each([
		['assetId vacía', { assetId: '  ' }],
		['asset ausente', undefined],
		['asset nulo', null],
	])('requires an existing primary image (%s)', (_label, mainImage) => {
		expect(checkArtworkCompleteness({ ...validArtwork, mainImage }, currentYear).errors)
			.toContain('mainImage');
	});

	it.each([
		['vacío', ''],
		['solo espacios', '   '],
		['más de 150 caracteres', 'a'.repeat(151)],
		['igual al título ignorando espacios exteriores', ' Figura '],
	])('rejects invalid localized alternative text: %s', (_label, altText) => {
		const result = checkArtworkCompleteness({
			...validArtwork,
			translation: { ...validArtwork.translation, altText },
		}, currentYear);

		expect(result.complete).toBe(false);
		expect(result.errors).toContain('translation.altText');
	});

	it('counts Unicode code points for the 150-character alternative-text limit', () => {
		const altText = '🎨'.repeat(150);
		expect(checkArtworkCompleteness({
			...validArtwork,
			translation: { ...validArtwork.translation, altText },
		}, currentYear).errors).not.toContain('translation.altText');
	});

	it.each([
		[1899, 'year'],
		[2027, 'year'],
		[2024.5, 'year'],
		['2024', 'year'],
		[0, 'dimensions'],
		[40.55, 'dimensions'],
		['40', 'dimensions'],
		['bad', 'inventoryNumber'],
		['AFT-2027-001', 'inventoryNumber'],
		['unavailable', 'availability'],
	])('rejects invalid required shared values: %s', (value, field) => {
		const input = field === 'year' || field === 'dimensions'
			? { ...validArtwork, [field === 'dimensions' ? 'heightCm' : field]: value }
			: { ...validArtwork, [field]: value };
		expect(checkArtworkCompleteness(input, currentYear).errors).toContain(field);
	});

	it('accepts valid localized text and optional content without generating missing data', () => {
		const input = {
			...validArtwork,
			workshopNote: '  Apunte del taller  ',
			criticalTextIds: ['critical-1', 'critical-2'],
		};

		expect(checkArtworkCompleteness(input, currentYear)).toEqual({
			complete: true,
			errors: [],
			optional: {
				workshopNote: 'Apunte del taller',
				criticalTextIds: ['critical-1', 'critical-2'],
			},
		});
	});

	it('omits empty or invalid optional content instead of blocking the version', () => {
		const result = checkArtworkCompleteness({
			...validArtwork,
			workshopNote: '   ',
			criticalTextIds: ['critical-1', '', null, '  '],
		}, currentYear);

		expect(result.complete).toBe(true);
		expect(result.optional).toEqual({ criticalTextIds: ['critical-1'] });
	});

	it('omits malformed optional fields without inventing replacements', () => {
		const result = checkArtworkCompleteness({
			...validArtwork,
			workshopNote: 123,
			criticalTextIds: 'critical-1',
		}, currentYear);

		expect(result.complete).toBe(true);
		expect(result.optional).toEqual({});
	});
});
