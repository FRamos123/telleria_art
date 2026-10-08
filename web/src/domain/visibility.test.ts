import { describe, expect, it } from 'vitest';
import { filterVisibleRelations, isSeriesVisible } from './visibility';

type Language = 'es' | 'en';

const publishedSeries: Partial<Record<Language, ReadonlySet<string>>> = {
	es: new Set(['series-1', 'series-2']),
	en: new Set(['series-1']),
};

describe('isSeriesVisible', () => {
	it('shows a published series only while it has a visible artwork in the same language', () => {
		const visibleArtworks = {
			es: [{ id: 'artwork-es', seriesId: 'series-1' }],
			en: [],
		};

		expect(isSeriesVisible('series-1', 'es', publishedSeries, visibleArtworks)).toBe(true);
		expect(isSeriesVisible('series-1', 'en', publishedSeries, visibleArtworks)).toBe(false);
	});

	it('hides an unpublished series or a published series without visible artworks', () => {
		const visibleArtworks = {
			es: [{ id: 'artwork-es', seriesId: 'series-1' }],
		};

		expect(isSeriesVisible('series-3', 'es', publishedSeries, visibleArtworks)).toBe(false);
		expect(isSeriesVisible('series-2', 'es', publishedSeries, visibleArtworks)).toBe(false);
	});
});

describe('filterVisibleRelations', () => {
	it('hides relations whose destination is not visible in the current language', () => {
		const relationIds = ['artwork-visible', 'artwork-hidden'];
		const visibleDestinations = {
			es: new Set(['artwork-visible']),
			en: new Set(['artwork-hidden']),
		};

		expect(filterVisibleRelations(relationIds, 'es', visibleDestinations)).toEqual(['artwork-visible']);
		expect(filterVisibleRelations(relationIds, 'en', visibleDestinations)).toEqual(['artwork-hidden']);
	});

	it('preserves source relations and makes a relation reappear when its destination becomes visible', () => {
		const relationIds = ['artwork-1'];
		const hidden = { es: new Set<string>() };
		const visible = { es: new Set(['artwork-1']) };

		expect(filterVisibleRelations(relationIds, 'es', hidden)).toEqual([]);
		expect(relationIds).toEqual(['artwork-1']);
		expect(filterVisibleRelations(relationIds, 'es', visible)).toEqual(['artwork-1']);
	});

	it('returns no relations when no destination is visible for the requested language', () => {
		expect(filterVisibleRelations(['series-1'], 'en', { es: new Set(['series-1']) })).toEqual([]);
	});
});
