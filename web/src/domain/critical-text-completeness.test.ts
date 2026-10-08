import { describe, expect, it } from 'vitest';
import { checkCriticalTextCompleteness } from './completeness';

describe('checkCriticalTextCompleteness', () => {
	it('accepts a complete Spanish original without translations or associations', () => {
		expect(checkCriticalTextCompleteness({
			originalLanguage: 'es',
			translations: {
				es: { title: 'Lectura de la obra', body: 'Texto crítico.', author: 'Crítica de arte' },
			},
		})).toEqual({
			complete: true,
			errors: [],
			originalLanguage: 'es',
			translations: {
				es: { title: 'Lectura de la obra', body: 'Texto crítico.', author: 'Crítica de arte' },
			},
			optional: {},
		});
	});

	it('accepts an English original without requiring a Spanish translation', () => {
		expect(checkCriticalTextCompleteness({
			originalLanguage: 'en',
			translations: {
				en: { title: 'Reading the work', body: 'Critical text.', author: 'Art critic' },
			},
		})).toEqual({
			complete: true,
			errors: [],
			originalLanguage: 'en',
			translations: {
				en: { title: 'Reading the work', body: 'Critical text.', author: 'Art critic' },
			},
			optional: {},
		});
	});

	it('includes a complete optional translation and valid optional associations', () => {
		expect(checkCriticalTextCompleteness({
			originalLanguage: 'en',
			translations: {
				en: { title: 'Reading the work', body: 'Critical text.', author: 'Art critic' },
				es: { title: 'Lectura de la obra', body: 'Texto crítico.', author: 'Crítica de arte' },
			},
			artworkIds: ['artwork-1'],
			seriesIds: ['series-1', 'series-2'],
		})).toEqual({
			complete: true,
			errors: [],
			originalLanguage: 'en',
			translations: {
				en: { title: 'Reading the work', body: 'Critical text.', author: 'Art critic' },
				es: { title: 'Lectura de la obra', body: 'Texto crítico.', author: 'Crítica de arte' },
			},
			optional: { artworkIds: ['artwork-1'], seriesIds: ['series-1', 'series-2'] },
		});
	});

	it.each([undefined, null, '', '  ', 'fr', 'ES'])('rejects an absent or invalid original language: %s', (originalLanguage) => {
		const result = checkCriticalTextCompleteness({
			originalLanguage,
			translations: {
				en: { title: 'Reading the work', body: 'Critical text.', author: 'Art critic' },
			},
		});

		expect(result.complete).toBe(false);
		expect(result.errors).toContain('originalLanguage');
		expect(result.translations).toEqual({});
	});

	it.each([
		['title', { title: '  ', body: 'Texto crítico.', author: 'Autora' }],
		['body', { title: 'Ensayo', body: '', author: 'Autora' }],
		['author', { title: 'Ensayo', body: 'Texto crítico.', author: null }],
	])('requires a non-empty %s in the original language', (field, original) => {
		const result = checkCriticalTextCompleteness({
			originalLanguage: 'es',
			translations: { es: original },
		});

		expect(result.complete).toBe(false);
		expect(result.errors).toContain(`translations.es.${field}`);
		expect(result.translations).toEqual({});
	});

	it('reports all missing required fields when the original translation is absent', () => {
		const result = checkCriticalTextCompleteness({ originalLanguage: 'es', translations: {} });

		expect(result.complete).toBe(false);
		expect(result.errors).toEqual([
			'translations.es.title',
			'translations.es.body',
			'translations.es.author',
		]);
	});

	it.each([
		undefined,
		{},
		{ title: 'Solo título' },
		{ title: 'Título', body: 'Cuerpo', author: '  ' },
	])('omits an absent or incomplete optional translation without blocking the original: %s', (optionalTranslation) => {
		const result = checkCriticalTextCompleteness({
			originalLanguage: 'es',
			translations: {
				es: { title: 'Ensayo', body: 'Texto crítico.', author: 'Autora' },
				en: optionalTranslation,
			},
		});

		expect(result.complete).toBe(true);
		expect(result.translations).toEqual({
			es: { title: 'Ensayo', body: 'Texto crítico.', author: 'Autora' },
		});
	});

	it('does not substitute an incomplete original with a complete optional translation', () => {
		const result = checkCriticalTextCompleteness({
			originalLanguage: 'es',
			translations: {
				es: { title: 'Ensayo', body: '', author: 'Autora' },
				en: { title: 'Essay', body: 'Critical text.', author: 'Art critic' },
			},
		});

		expect(result.complete).toBe(false);
		expect(result.errors).toContain('translations.es.body');
		expect(result.translations).toEqual({});
	});

	it('omits malformed optional associations and keeps valid IDs', () => {
		const result = checkCriticalTextCompleteness({
			originalLanguage: 'es',
			translations: {
				es: { title: 'Ensayo', body: 'Texto crítico.', author: 'Autora' },
			},
			artworkIds: ['artwork-1', '', null],
			seriesIds: 'series-1',
		});

		expect(result.complete).toBe(true);
		expect(result.optional).toEqual({ artworkIds: ['artwork-1'] });
	});
});
