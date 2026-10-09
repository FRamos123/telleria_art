import type { InventoryNumber } from './inventory-number'

export interface CatalogSortableArtwork {
	year: number
	inventoryNumber: InventoryNumber
}

export interface SeriesMetaDescriptionInput {
	editorialDescription?: string
	seriesName: string
	artistName: string
	template: string
}

export interface SeoMetadataEntry {
	path: string
	title: string
	description?: string
}

const MAX_META_DESCRIPTION_LENGTH = 155

/** Sorts mapped artworks by publication year descending and inventory ascending. */
export function sortArtworksForCatalog<T extends CatalogSortableArtwork>(
	artworks: readonly T[],
): T[] {
	return [...artworks].sort((first, second) => {
		const yearOrder = second.year - first.year
		if (yearOrder !== 0) return yearOrder
		if (first.inventoryNumber < second.inventoryNumber) return -1
		if (first.inventoryNumber > second.inventoryNumber) return 1
		return 0
	})
}

/** Derives a localized series description from editorial text or its fallback template. */
export function deriveSeriesMetaDescription({
	editorialDescription,
	seriesName,
	artistName,
	template,
}: SeriesMetaDescriptionInput): string {
	const description = editorialDescription?.trim()
	if (!description) {
		return template
			.replaceAll('{seriesName}', seriesName)
			.replaceAll('{artistName}', artistName)
	}

	const characters = Array.from(description)
	if (characters.length <= MAX_META_DESCRIPTION_LENGTH) return description

	const limitedCharacters = characters.slice(0, MAX_META_DESCRIPTION_LENGTH)
	let lastWordBoundary = -1
	for (let index = 0; index < limitedCharacters.length; index += 1) {
		if (/\s/u.test(limitedCharacters[index])) lastWordBoundary = index
	}

	// An unbroken string has no earlier word boundary, so cap it without splitting a surrogate pair.
	if (lastWordBoundary === -1) return limitedCharacters.join('')
	return limitedCharacters.slice(0, lastWordBoundary).join('').trimEnd()
}

/** Throws when public pages share a title or a non-empty meta description. */
export function assertUniqueSeoMetadata(pages: readonly SeoMetadataEntry[]): void {
	const issues = [
		...findDuplicateMetadata(pages, 'title', (page) => page.title),
		...findDuplicateMetadata(pages, 'description', (page) => page.description),
	]

	if (issues.length > 0) {
		throw new Error(`Duplicate SEO metadata detected:\n${issues.join('\n')}`)
	}
}

function findDuplicateMetadata(
	pages: readonly SeoMetadataEntry[],
	field: 'title' | 'description',
	getValue: (page: SeoMetadataEntry) => string | undefined,
): string[] {
	const pathsByValue = new Map<string, string[]>()
	for (const page of pages) {
		const value = getValue(page)
		if (!value) continue

		const paths = pathsByValue.get(value) ?? []
		paths.push(page.path)
		pathsByValue.set(value, paths)
	}

	return [...pathsByValue]
		.filter(([, paths]) => paths.length > 1)
		.map(([value, paths]) => `- duplicate ${field} "${value}" on ${paths.join(', ')}`)
}
