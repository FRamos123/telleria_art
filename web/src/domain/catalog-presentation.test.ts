import { describe, expect, it } from 'vitest'
import { createInventoryNumber } from './inventory-number'
import {
	assertUniqueSeoMetadata,
	deriveSeriesMetaDescription,
	sortArtworksForCatalog,
} from './catalog-presentation'

const currentYear = 2026

function artwork(id: string, year: number, inventory: string) {
	const inventoryNumber = createInventoryNumber(inventory, currentYear)
	if (!inventoryNumber) throw new Error(`Invalid test inventory number: ${inventory}`)
	return { id, year, inventoryNumber }
}

describe('sortArtworksForCatalog', () => {
	it('orders by artwork year descending, then inventory number ascending', () => {
		const artworks = [
			artwork('older', 2022, 'AFT-2024-001'),
			artwork('same-year-later-inventory', 2024, 'AFT-2023-020'),
			artwork('newer', 2025, 'AFT-2020-001'),
			artwork('same-year-earlier-inventory', 2024, 'AFT-2023-002'),
		]

		expect(sortArtworksForCatalog(artworks).map(({ id }) => id)).toEqual([
			'newer',
			'same-year-earlier-inventory',
			'same-year-later-inventory',
			'older',
		])
	})

	it('returns a deterministic sorted copy without mutating the source', () => {
		const artworks = [
			artwork('third', 2023, 'AFT-2023-003'),
			artwork('first', 2025, 'AFT-2025-001'),
			artwork('second', 2024, 'AFT-2024-002'),
		]
		const originalOrder = [...artworks]

		const firstResult = sortArtworksForCatalog(artworks)

		expect(firstResult).toEqual(sortArtworksForCatalog(artworks))
		expect(firstResult).not.toBe(artworks)
		expect(artworks).toEqual(originalOrder)
	})

	it('preserves input order when year and inventory are equal', () => {
		const artworks = [
			artwork('first', 2024, 'AFT-2024-001'),
			artwork('second', 2024, 'AFT-2024-001'),
		]

		expect(sortArtworksForCatalog(artworks).map(({ id }) => id)).toEqual(['first', 'second'])
	})
})

describe('deriveSeriesMetaDescription', () => {
	const template = 'Obras de la serie {seriesName} de {artistName}.'

	it('truncates an editorial description at the last word boundary within 155 characters', () => {
		const description = `${'palabra '.repeat(19)}final palabra fuera del límite`

		const result = deriveSeriesMetaDescription({
			editorialDescription: description,
			seriesName: 'Serie',
			artistName: 'Artista',
			template,
		})

		expect(result).toBe('palabra '.repeat(19).trimEnd())
		expect(Array.from(result)).toHaveLength(151)
	})

	it('uses the localized template when the editorial description is absent or blank', () => {
		expect(deriveSeriesMetaDescription({
			seriesName: 'Materia oscura',
			artistName: 'Alejandro Fernández Tellería',
			template,
		})).toBe('Obras de la serie Materia oscura de Alejandro Fernández Tellería.')

		expect(deriveSeriesMetaDescription({
			editorialDescription: '   ',
			seriesName: 'Materia oscura',
			artistName: 'Alejandro Fernández Tellería',
			template,
		})).toBe('Obras de la serie Materia oscura de Alejandro Fernández Tellería.')
	})

	it('keeps a short editorial description intact', () => {
		expect(deriveSeriesMetaDescription({
			editorialDescription: 'Una descripción editorial.',
			seriesName: 'Serie',
			artistName: 'Artista',
			template,
		})).toBe('Una descripción editorial.')
	})

	it('caps an unbroken description at 155 Unicode characters', () => {
		const result = deriveSeriesMetaDescription({
			editorialDescription: 'á'.repeat(156),
			seriesName: 'Serie',
			artistName: 'Artista',
			template,
		})

		expect(Array.from(result)).toHaveLength(155)
	})
})

describe('assertUniqueSeoMetadata', () => {
	it('does not reject unique metadata or missing descriptions', () => {
		expect(() => assertUniqueSeoMetadata([
			{ path: '/obras/', title: 'Obras', description: undefined },
			{ path: '/series/a/', title: 'Serie A', description: 'Descripción A' },
			{ path: '/series/b/', title: 'Serie B' },
		])).not.toThrow()
	})

	it('throws when page titles are duplicated', () => {
		expect(() => assertUniqueSeoMetadata([
			{ path: '/series/a/', title: 'Serie', description: 'Descripción A' },
			{ path: '/series/b/', title: 'Serie', description: 'Descripción B' },
		])).toThrow(/duplicate.*title/i)
	})

	it('throws when meta descriptions are duplicated', () => {
		expect(() => assertUniqueSeoMetadata([
			{ path: '/series/a/', title: 'Serie A', description: 'Descripción' },
			{ path: '/series/b/', title: 'Serie B', description: 'Descripción' },
		])).toThrow(/duplicate.*description/i)
	})
})
