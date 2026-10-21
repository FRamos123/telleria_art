import type { APIRoute } from 'astro'
import type { Availability } from '../domain/availability'
import type { Locale } from '../i18n'
import type { MappedArtworkTranslation } from '../infrastructure/sanity/mappers'
import { loadCatalogContent } from '../infrastructure/sanity/catalog-content'

interface ContactArtworkIndexEntry {
	id: string
	availability: Availability
	translations: Partial<Record<Locale, Pick<MappedArtworkTranslation, 'title'>>>
}

export type ContactArtworkIndex = Record<Locale, string[]>

/** Projects published artwork IDs per locale; availability never filters an inquiry option. */
export function createContactArtworkIndex(
	artworks: readonly ContactArtworkIndexEntry[],
): ContactArtworkIndex {
	return {
		es: artworks.flatMap((artwork) => artwork.translations.es ? [artwork.id] : []),
		en: artworks.flatMap((artwork) => artwork.translations.en ? [artwork.id] : []),
	}
}

export const prerender = true

export const GET: APIRoute = async () => {
	const catalog = await loadCatalogContent()
	const body = JSON.stringify(createContactArtworkIndex(catalog.artworks))
	return new Response(body, {
		headers: { 'content-type': 'application/json; charset=utf-8' },
	})
}
