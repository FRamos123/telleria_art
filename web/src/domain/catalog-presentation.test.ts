import { describe, expect, it } from 'vitest'
import { createInventoryNumber } from './inventory-number'
import { createCalendarDate } from './calendar-date'
import {
	assertUniqueSeoMetadata,
	deriveCriticalTextMetaDescription,
	deriveExhibitionMetaDescription,
	deriveSeriesMetaDescription,
	selectRecentHomeArtworks,
	sortArtworksForCatalog,
	sortCriticalTextsForIndex,
	sortExhibitionsForIndex,
} from './catalog-presentation'

const currentYear = 2026

function homeArtwork(id: string, year: number) {
	return { id, year }
}

function artwork(id: string, year: number, inventory: string) {
	const inventoryNumber = createInventoryNumber(inventory, currentYear)
	if (!inventoryNumber) throw new Error(`Invalid test inventory number: ${inventory}`)
	return { id, year, inventoryNumber }
}

function exhibition(id: string, startDate: string, spanishTitle: string, englishTitle: string) {
	const date = createCalendarDate(startDate)
	if (!date) throw new Error(`Invalid test exhibition date: ${startDate}`)
	return {
		id,
		startDate: date,
		translations: {
			es: { title: spanishTitle },
			en: { title: englishTitle },
		},
	}
}

function criticalText(id: string, spanishTitle: string, englishTitle: string) {
	return {
		id,
		translations: {
			es: { title: spanishTitle },
			en: { title: englishTitle },
		},
	}
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

describe('selectRecentHomeArtworks', () => {
	it('orders by year descending, then ID using ordinal case-sensitive comparison', () => {
		const artworks = [
			homeArtwork('older', 2022),
			homeArtwork('b', 2025),
			homeArtwork('a', 2025),
			homeArtwork('A', 2025),
		]

		expect(selectRecentHomeArtworks(artworks).map(({ id }) => id)).toEqual([
			'A',
			'a',
			'b',
		])
	})

	it('returns at most three artworks after sorting', () => {
		const artworks = [
			homeArtwork('fourth', 2022),
			homeArtwork('third', 2023),
			homeArtwork('second', 2024),
			homeArtwork('first', 2025),
		]

		expect(selectRecentHomeArtworks(artworks).map(({ id }) => id)).toEqual([
			'first',
			'second',
			'third',
		])
	})

	it.each([
		{ label: 'zero', artworks: [], expected: [] },
		{ label: 'one', artworks: [homeArtwork('single', 2025)], expected: ['single'] },
		{
			label: 'two',
			artworks: [homeArtwork('older', 2024), homeArtwork('newer', 2025)],
			expected: ['newer', 'older'],
		},
	])('preserves a list of $label artworks', ({ artworks, expected }) => {
		expect(selectRecentHomeArtworks(artworks).map(({ id }) => id)).toEqual(expected)
	})

	it('returns a sorted copy without mutating the input', () => {
		const artworks = [homeArtwork('older', 2023), homeArtwork('newer', 2025)]
		const originalOrder = [...artworks]

		const result = selectRecentHomeArtworks(artworks)

		expect(result).not.toBe(artworks)
		expect(artworks).toEqual(originalOrder)
	})
})

describe('sortExhibitionsForIndex', () => {
	it('orders by start date descending, then localized title and stable ID', () => {
		const exhibitions = [
			exhibition('older', '2023-05-01', 'Zeta', 'Zulu'),
			exhibition('same-title-b', '2024-05-01', 'Alfa', 'Alpha'),
			exhibition('newer', '2025-05-01', 'Zeta', 'Zulu'),
			exhibition('same-title-a', '2024-05-01', 'Alfa', 'Alpha'),
			exhibition('same-date-b', '2024-05-01', 'Beta', 'Bravo'),
		]

		expect(sortExhibitionsForIndex(exhibitions, 'es').map(({ id }) => id)).toEqual([
			'newer',
			'same-title-a',
			'same-title-b',
			'same-date-b',
			'older',
		])
	})

	it('uses the requested language for title tie-breaking and returns a copy', () => {
		const exhibitions = [
			exhibition('first-in-english', '2024-05-01', 'Zeta', 'Alpha'),
			exhibition('first-in-spanish', '2024-05-01', 'Alfa', 'Zulu'),
		]

		expect(sortExhibitionsForIndex(exhibitions, 'es').map(({ id }) => id)).toEqual([
			'first-in-spanish',
			'first-in-english',
		])
		expect(sortExhibitionsForIndex(exhibitions, 'en').map(({ id }) => id)).toEqual([
			'first-in-english',
			'first-in-spanish',
		])
		expect(sortExhibitionsForIndex(exhibitions, 'es')).not.toBe(exhibitions)
		expect(exhibitions.map(({ id }) => id)).toEqual(['first-in-english', 'first-in-spanish'])
	})
})

describe('sortCriticalTextsForIndex', () => {
	it('orders titles with the requested language collation and stable ID tie-breaking', () => {
		const texts = [
			criticalText('critical-z', 'Repetido', 'Same title'),
			criticalText('critical-b', 'Bote', 'Zulu'),
			criticalText('critical-a', 'Repetido', 'Alpha'),
			criticalText('critical-a-tree', 'Árbol', 'Tree'),
		]

		expect(sortCriticalTextsForIndex(texts, 'es').map(({ id }) => id)).toEqual([
			'critical-a-tree',
			'critical-b',
			'critical-a',
			'critical-z',
		])
		expect(sortCriticalTextsForIndex(texts, 'en').map(({ id }) => id)).toEqual([
			'critical-a',
			'critical-z',
			'critical-a-tree',
			'critical-b',
		])
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

describe('deriveExhibitionMetaDescription', () => {
	it('combines only the published title, venue, and localized dates', () => {
		expect(deriveExhibitionMetaDescription({
			title: 'Exposición reciente',
			venue: 'Vigo',
			localizedStartDate: '2 de mayo de 2024',
			localizedEndDate: '15 de junio de 2024',
		})).toBe('Exposición reciente — Vigo — 2 de mayo de 2024 – 15 de junio de 2024')
	})

	it('omits the final date when an exhibition has no end date', () => {
		expect(deriveExhibitionMetaDescription({
			title: 'Exposición reciente',
			venue: 'Vigo',
			localizedStartDate: '2 de mayo de 2024',
		})).toBe('Exposición reciente — Vigo — 2 de mayo de 2024')
	})
})

describe('deriveCriticalTextMetaDescription', () => {
	it('trims a short body without replacing or rewriting it', () => {
		expect(deriveCriticalTextMetaDescription('  Un comienzo publicado.  '))
			.toBe('Un comienzo publicado.')
	})

	it('truncates at the last word boundary within 155 Unicode characters', () => {
		const body = `${'palabra '.repeat(19)}final palabra fuera del límite`
		const description = deriveCriticalTextMetaDescription(body)

		expect(description).toBe('palabra '.repeat(19).trimEnd())
		expect(Array.from(description)).toHaveLength(151)
	})

	it('keeps a complete word that ends exactly at the 155-character boundary', () => {
		const firstWord = 'á'.repeat(155)

		expect(deriveCriticalTextMetaDescription(`${firstWord} siguiente`)).toBe(firstWord)
	})

	it('omits an overlong unbroken first word rather than splitting it or exceeding 155 characters', () => {
		expect(deriveCriticalTextMetaDescription('á'.repeat(156))).toBe('')
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
