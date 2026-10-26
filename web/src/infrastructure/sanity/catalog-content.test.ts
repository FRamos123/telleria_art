import { describe, expect, it, vi } from 'vitest'
import type { SanityClient } from '@sanity/client'
import {
	artworkQuery,
	criticalTextQuery,
	exhibitionQuery,
	seriesQuery,
	siteSettingsQuery,
} from './queries'
import { loadCatalogContent, loadCatalogSeoDescriptions, loadHomeIntroductions } from './catalog-content'

const currentYear = 2026

function image(id: string) {
	return {
		asset: {
			_id: id,
			url: `https://cdn.sanity.io/images/project/dataset/${id}.jpg`,
			metadata: { dimensions: { width: 1200, height: 1600 } },
		},
		crop: { top: 0, bottom: 0, left: 0, right: 0 },
		hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
	}
}

function artwork(id: string, inventoryNumber: string, englishSupport: string) {
	return {
		_id: id,
		seriesId: 'series-1',
		criticalTextIds: [],
		mainImage: image(`${id}-image`),
		year: 2024,
		dimensions: { heightCm: 60, widthCm: 45 },
		inventoryNumber,
		availability: 'disponible',
		translations: [
			{
				_id: `${id}-es`,
				language: 'es',
				title: `[TEST] Obra ES ${id}`,
				technique: 'Óleo',
				support: 'Lienzo',
				altText: `[TEST] Descripción ES ${id}`,
			},
			{
				_id: `${id}-en`,
				language: 'en',
				title: `[TEST] Artwork EN ${id}`,
				technique: 'Oil',
				support: englishSupport,
				altText: `[TEST] Description EN ${id}`,
			},
		],
	}
}

function exhibition(id: string, imageAlt: string) {
	return {
		_id: id,
		startDate: '2024-05-02',
		endDate: '2024-06-15',
		image: image(`${id}-image`),
		artworkIds: ['artwork-1'],
		seriesIds: ['series-1'],
		translations: [{
			_id: `${id}-es`,
			language: 'es',
			title: `[TEST] Exposición ${id}`,
			venue: '[TEST] Vigo',
			imageAlt,
		}],
	}
}

function criticalText(id: string) {
	return {
		_id: id,
		originalLanguage: 'es',
		artworkIds: ['artwork-1'],
		seriesIds: ['series-1'],
		translations: [{
			_id: `${id}-es`,
			language: 'es',
			title: `[TEST] Texto crítico ${id}`,
			body: '[TEST] Cuerpo crítico.',
			author: '[TEST] Autoría',
		}],
	}
}

describe('loadCatalogContent', () => {
	it('loads all published content queries and preserves mapper visibility by language', async () => {
		const artworks = [
			artwork('artwork-1', 'AFT-2024-001', 'Canvas'),
			artwork('artwork-2', 'AFT-2024-002', '  '),
		]
		const series = [{
			_id: 'series-1',
			translations: [{ _id: 'series-1-es', language: 'es', name: '[TEST] Serie ES' }],
		}]
		const exhibitions = [exhibition('exhibition-1', '[TEST] Sala de exposición')]
		const criticalTexts = [criticalText('critical-1')]
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === artworkQuery) return artworks
			if (query === seriesQuery) return series
			if (query === exhibitionQuery) return exhibitions
			if (query === criticalTextQuery) return criticalTexts
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(fetch).toHaveBeenCalledTimes(4)
		expect(fetch).toHaveBeenNthCalledWith(1, artworkQuery)
		expect(fetch).toHaveBeenNthCalledWith(2, seriesQuery)
		expect(fetch).toHaveBeenNthCalledWith(3, exhibitionQuery)
		expect(fetch).toHaveBeenNthCalledWith(4, criticalTextQuery)
		expect(catalog.artworks).toHaveLength(2)
		expect(catalog.artworks[0]?.translations).not.toHaveProperty('en')
		expect(catalog.artworks[0]?.seriesId).toBe('series-1')
		expect(catalog.artworks[1]?.translations).not.toHaveProperty('en')
		expect(catalog.artworks[1]?.seriesId).toBe('series-1')
		expect(catalog.series[0]?.translations).toEqual({ es: { name: '[TEST] Serie ES' } })
		expect(catalog.exhibitions[0]).toMatchObject({
			id: 'exhibition-1',
			translations: {
				es: {
					title: '[TEST] Exposición exhibition-1',
					artworkIds: ['artwork-1'],
					seriesIds: ['series-1'],
				},
			},
		})
		expect(catalog.criticalTexts[0]).toMatchObject({
			id: 'critical-1',
			translations: {
				es: {
					title: '[TEST] Texto crítico critical-1',
					artworkIds: ['artwork-1'],
					seriesIds: ['series-1'],
				},
			},
		})
		expect(catalog.exhibitionImageProjections.get('exhibition-1')).toEqual({
			asset: {
				_id: 'exhibition-1-image',
				metadata: { dimensions: { width: 1200, height: 1600 } },
			},
			crop: { top: 0, bottom: 0, left: 0, right: 0 },
			hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
		})
	})

	it('keeps exhibition image projections only when a visible translation accepts the same asset', async () => {
		const rawExhibitions = [
			exhibition('exhibition-valid-image', '[TEST] Sala válida'),
			exhibition('exhibition-invalid-alt', '[TEST] Exposición exhibition-invalid-alt'),
		]
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === artworkQuery) return [artwork('artwork-1', 'AFT-2024-005', 'Canvas')]
			if (query === seriesQuery) return [{
				_id: 'series-1',
				translations: [{ _id: 'series-1-es', language: 'es', name: '[TEST] Serie ES' }],
			}]
			if (query === exhibitionQuery) return rawExhibitions
			if (query === criticalTextQuery) return []
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(catalog.exhibitions).toHaveLength(2)
		expect(catalog.exhibitions[0]?.translations.es?.image?.assetId).toBe('exhibition-valid-image-image')
		expect(catalog.exhibitions[1]?.translations.es).not.toHaveProperty('image')
		expect(catalog.exhibitionImageProjections.has('exhibition-valid-image')).toBe(true)
		expect(catalog.exhibitionImageProjections.has('exhibition-invalid-alt')).toBe(false)
	})

	it('keeps responsive image projections only for series images accepted by the visibility mapper', async () => {
		const visibleArtwork = artwork('artwork-series-image', 'AFT-2024-003', 'Canvas')
		const rawSeries = [{
			_id: 'series-1',
			image: image('series-image'),
			translations: [{
				_id: 'series-1-es',
				language: 'es',
				name: '[TEST] Serie ES',
				imageAlt: '[TEST] Imagen de la serie',
			}],
		}]
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === artworkQuery) return [visibleArtwork]
			if (query === seriesQuery) return rawSeries
			if (query === exhibitionQuery || query === criticalTextQuery) return []
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(catalog.seriesImageProjections.get('series-1')).toEqual({
			asset: {
				_id: 'series-image',
				metadata: { dimensions: { width: 1200, height: 1600 } },
			},
			crop: { top: 0, bottom: 0, left: 0, right: 0 },
			hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
		})
	})

	it('omits raw image projections when the visible series translation has no valid localized image', async () => {
		const rawSeries = [{
			_id: 'series-1',
			image: image('series-image'),
			translations: [{ _id: 'series-1-es', language: 'es', name: '[TEST] Serie ES' }],
		}]
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === artworkQuery) return [artwork('artwork-no-series-image', 'AFT-2024-004', 'Canvas')]
			if (query === seriesQuery) return rawSeries
			if (query === exhibitionQuery || query === criticalTextQuery) return []
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(catalog.seriesImageProjections.has('series-1')).toBe(false)
	})
})

describe('loadCatalogSeoDescriptions', () => {
	it('fetches the published singleton and exposes each language description independently', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) {
				return {
					catalogSeoDescriptionEs: '  [TEST] Descripción SEO del catálogo ES  ',
					catalogSeoDescriptionEn: '[TEST] Catalog SEO description EN',
				}
			}
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const descriptions = await loadCatalogSeoDescriptions(client)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(fetch).toHaveBeenCalledWith(siteSettingsQuery)
		expect(descriptions).toEqual({
			es: '[TEST] Descripción SEO del catálogo ES',
			en: '[TEST] Catalog SEO description EN',
		})
	})

	it('keeps missing or whitespace-only texts absent per language without fallback', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) {
				return { catalogSeoDescriptionEs: '   ', catalogSeoDescriptionEn: null }
			}
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const descriptions = await loadCatalogSeoDescriptions(client)

		expect(descriptions).toEqual({})
	})

	it('treats a missing settings document as an empty set of descriptions', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) return null
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const descriptions = await loadCatalogSeoDescriptions(client)

		expect(descriptions).toEqual({})
	})
})

describe('loadHomeIntroductions', () => {
	it('loads and trims each approved language independently', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) {
				return {
					homeIntroductionEs: '  [TEST] Presentación breve ES  ',
					homeIntroductionEn: '  [TEST] Short introduction EN  ',
				}
			}
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const introductions = await loadHomeIntroductions(client)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(fetch).toHaveBeenCalledWith(siteSettingsQuery)
		expect(introductions).toEqual({
			es: '[TEST] Presentación breve ES',
			en: '[TEST] Short introduction EN',
		})
	})

	it('omits blank languages without falling back to the other language', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) {
				return { homeIntroductionEs: '   ', homeIntroductionEn: '[TEST] English only' }
			}
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const introductions = await loadHomeIntroductions(client)

		expect(introductions).toEqual({ en: '[TEST] English only' })
	})

	it('treats missing settings or absent texts as no introductions', async () => {
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === siteSettingsQuery) return null
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		expect(await loadHomeIntroductions(client)).toEqual({})
	})
})
