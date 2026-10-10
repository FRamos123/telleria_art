import { describe, expect, it, vi } from 'vitest'
import type { SanityClient } from '@sanity/client'
import { artworkQuery, seriesQuery } from './queries'
import { loadCatalogContent } from './catalog-content'

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

describe('loadCatalogContent', () => {
	it('loads artwork and series queries and preserves mapper visibility by language', async () => {
		const artworks = [
			artwork('artwork-visible-en', 'AFT-2024-001', 'Canvas'),
			artwork('artwork-es-only', 'AFT-2024-002', '  '),
		]
		const series = [{
			_id: 'series-1',
			translations: [{ _id: 'series-1-es', language: 'es', name: '[TEST] Serie ES' }],
		}]
		const fetch = vi.fn(async (query: string): Promise<unknown> => {
			if (query === artworkQuery) return artworks
			if (query === seriesQuery) return series
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(fetch).toHaveBeenCalledTimes(2)
		expect(fetch).toHaveBeenNthCalledWith(1, artworkQuery)
		expect(fetch).toHaveBeenNthCalledWith(2, seriesQuery)
		expect(catalog.artworks).toHaveLength(2)
		expect(catalog.artworks[0]?.translations).not.toHaveProperty('en')
		expect(catalog.artworks[0]?.seriesId).toBe('series-1')
		expect(catalog.artworks[1]?.translations).not.toHaveProperty('en')
		expect(catalog.artworks[1]?.seriesId).toBe('series-1')
		expect(catalog.series[0]?.translations).toEqual({ es: { name: '[TEST] Serie ES' } })
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
			throw new Error(`Unexpected query: ${query}`)
		})
		const client = { fetch } as unknown as SanityClient

		const catalog = await loadCatalogContent(client, currentYear)

		expect(catalog.seriesImageProjections.has('series-1')).toBe(false)
	})
})
