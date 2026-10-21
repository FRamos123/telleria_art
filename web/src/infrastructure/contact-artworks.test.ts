import { describe, expect, it } from 'vitest'
import { createContactArtworkIndex } from '../pages/contact-artworks.json'

describe('createContactArtworkIndex', () => {
	it('includes artworks from all four availability states when translated for the locale', () => {
		const artworks = [
			{ id: 'available', availability: 'disponible', translations: { es: { title: '[TEST] Disponible ES' }, en: { title: '[TEST] Available EN' } } },
			{ id: 'reserved', availability: 'reservada', translations: { es: { title: '[TEST] Reservada ES' }, en: { title: '[TEST] Reserved EN' } } },
			{ id: 'sold', availability: 'vendida', translations: { es: { title: '[TEST] Vendida ES' }, en: { title: '[TEST] Sold EN' } } },
			{ id: 'collection', availability: 'en colección', translations: { es: { title: '[TEST] En colección ES' }, en: { title: '[TEST] In collection EN' } } },
		] as const

		expect(createContactArtworkIndex(artworks)).toEqual({
			es: ['available', 'reserved', 'sold', 'collection'],
			en: ['available', 'reserved', 'sold', 'collection'],
		})
	})

	it('omits an artwork from a locale without a published translation and does not fall back', () => {
		const artworks = [
			{ id: 'spanish-only', availability: 'disponible', translations: { es: { title: '[TEST] Solo ES' } } },
		] as const

		expect(createContactArtworkIndex(artworks)).toEqual({ es: ['spanish-only'], en: [] })
	})
})
