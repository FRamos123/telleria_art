import {
	checkArtworkCompleteness,
	checkCriticalTextCompleteness,
	checkExhibitionCompleteness,
	checkSeriesCompleteness,
	type CriticalTextLanguage,
	type CriticalTextTranslation,
	type EditorialImage,
} from '../../domain/completeness'
import { isAvailability, type Availability } from '../../domain/availability'
import { assertUniqueInventoryNumbers } from '../../domain/catalog-validation'
import type { CalendarDate } from '../../domain/calendar-date'
import { createDimensions } from '../../domain/dimensions'
import { createInventoryNumber, type InventoryNumber } from '../../domain/inventory-number'
import { filterVisibleRelations, isSeriesVisible } from '../../domain/visibility'
import type { PublicationLanguage } from '../../domain/publication'
import type { SanityImageProjection } from './image-url'

type Language = PublicationLanguage

export interface MappedArtworkTranslation {
	title: string
	technique: string
	support: string
	altText: string
}

export interface MappedArtwork {
	id: string
	seriesId: string
	mainImage: { assetId: string; projection: SanityImageProjection }
	year: number
	heightCm: number
	widthCm: number
	inventoryNumber: InventoryNumber
	availability: Availability
	translations: Partial<Record<Language, MappedArtworkTranslation>>
	optional: {
		workshopNote?: string
		criticalTextIds?: string[]
	}
}

export interface MappedSeriesTranslation {
	name: string
	description?: string
	image?: EditorialImage
}

export interface MappedSeries {
	id: string
	translations: Partial<Record<Language, MappedSeriesTranslation>>
}

export interface MappedExhibitionTranslation {
	title: string
	venue: string
	image?: EditorialImage
	artworkIds: string[]
	seriesIds: string[]
}

export interface MappedExhibition {
	id: string
	startDate: CalendarDate
	endDate?: CalendarDate
	translations: Partial<Record<Language, MappedExhibitionTranslation>>
}

export interface MappedCriticalTextTranslation extends CriticalTextTranslation {
	artworkIds: string[]
	seriesIds: string[]
}

export interface MappedCriticalText {
	id: string
	originalLanguage: CriticalTextLanguage
	translations: Partial<Record<Language, MappedCriticalTextTranslation>>
}

export interface MappedSanityContent {
	artworks: MappedArtwork[]
	series: MappedSeries[]
	exhibitions: MappedExhibition[]
	criticalTexts: MappedCriticalText[]
}

interface ArtworkCandidate {
	content: MappedArtwork
	relationSeriesId: string
}

interface SeriesCandidate {
	content: MappedSeries
}

const LANGUAGES: readonly Language[] = ['es', 'en']

/** Maps published GROQ results to complete, locale-specific domain content. */
export function mapSanityContent(input: unknown, currentYear: number): MappedSanityContent {
	const results = asRecord(input)
	const artworkCandidates = mapArtworkCandidates(results?.artworks, currentYear)
	const seriesCandidates = mapSeriesCandidates(results?.series)
	const artworks = artworkCandidates.map(({ content }) => content)
	const publishedSeriesIds = seriesIdsByLanguage(seriesCandidates)
	const visibleArtworks = visibleArtworkRelationsByLanguage(artworkCandidates)
	const visibleSeries = seriesCandidates
		.map(({ content }) => ({
			...content,
			translations: filterTranslations(content.translations, (language) =>
				isSeriesVisible(content.id, language, publishedSeriesIds, visibleArtworks),
			),
		}))
		.filter((series) => series.translations.es !== undefined)

	const visibleArtworkIds = idsByLanguage(artworks)
	const visibleSeriesIds = idsByLanguage(visibleSeries)
	const exhibitions = mapExhibitions(results?.exhibitions, visibleArtworkIds, visibleSeriesIds)
	const criticalTexts = mapCriticalTexts(
		results?.criticalTexts,
		visibleArtworkIds,
		visibleSeriesIds,
	)

	// The catalog is rejected before callers can generate a new static output.
	assertUniqueInventoryNumbers(artworks)

	return { artworks, series: visibleSeries, exhibitions, criticalTexts }
}

function mapArtworkCandidates(value: unknown, currentYear: number): ArtworkCandidate[] {
	const candidates: ArtworkCandidate[] = []
	for (const rawValue of asArray(value)) {
		const raw = asRecord(rawValue)
		const id = normalizedText(raw?._id)
		const seriesId = normalizedText(raw?.seriesId)
		const image = resolvedImage(raw?.mainImage)
		const dimensions = asRecord(raw?.dimensions)
		if (!id || !seriesId || !image) continue

		const translated = uniqueTranslations(raw?.translations)
		const shared = {
			seriesId,
			mainImage: { assetId: image.assetId },
			year: raw?.year,
			heightCm: dimensions?.height,
			widthCm: dimensions?.width,
			inventoryNumber: raw?.inventoryNumber,
			availability: raw?.availability,
			workshopNote: raw?.workshopNote,
			criticalTextIds: raw?.criticalTextIds,
		}
		const translations: Partial<Record<Language, MappedArtworkTranslation>> = {}
		let optional: MappedArtwork['optional'] = {}
		for (const language of LANGUAGES) {
			const translation = translated[language]
			if (!translation) continue
			const completeness = checkArtworkCompleteness(
				{ ...shared, translation: { ...translation, altText: translation.altText } },
				currentYear,
			)
			if (!completeness.complete) continue
			const title = normalizedText(translation.title)
			const technique = normalizedText(translation.technique)
			const support = normalizedText(translation.support)
			const altText = normalizedText(translation.altText)
			if (!title || !technique || !support || !altText) continue
			translations[language] = { title, technique, support, altText }
			if (language === 'es') optional = completeness.optional
		}

		// Spanish is the base version for artwork visibility; English never fills its gaps.
		if (!translations.es) continue
		const year = raw?.year
		const dimensionsValue = createDimensions(dimensions?.height, dimensions?.width)
		const inventoryNumber = createInventoryNumber(raw?.inventoryNumber, currentYear)
		if (typeof year !== 'number' || !dimensionsValue || !inventoryNumber || !isAvailability(raw?.availability)) {
			continue
		}

		candidates.push({
			relationSeriesId: seriesId,
			content: {
				id,
				seriesId,
				mainImage: image,
				year,
				heightCm: dimensionsValue.heightCm,
				widthCm: dimensionsValue.widthCm,
				inventoryNumber,
				availability: raw.availability,
				translations,
				optional,
			},
		})
	}
	return candidates
}
function mapSeriesCandidates(value: unknown): SeriesCandidate[] {
	const candidates: SeriesCandidate[] = []
	for (const rawValue of asArray(value)) {
		const raw = asRecord(rawValue)
		const id = normalizedText(raw?._id)
		if (!id) continue
		const image = resolvedImage(raw?.image)
		const translated = uniqueTranslations(raw?.translations)
		const translations: Partial<Record<Language, MappedSeriesTranslation>> = {}
		for (const language of LANGUAGES) {
			const translation = translated[language]
			if (!translation) continue
			const completeness = checkSeriesCompleteness({
				image: image ? { assetId: image.assetId } : undefined,
				translation,
			})
			if (!completeness.complete) continue
			const name = normalizedText(translation.name)
			if (!name) continue
			translations[language] = {
				name,
				...(completeness.optional.description
					? { description: completeness.optional.description }
					: {}),
				...(completeness.optional.image ? { image: completeness.optional.image } : {}),
			}
		}
		if (translations.es) candidates.push({ content: { id, translations } })
	}
	return candidates
}

function mapExhibitions(
	value: unknown,
	visibleArtworkIds: Partial<Record<Language, ReadonlySet<string>>>,
	visibleSeriesIds: Partial<Record<Language, ReadonlySet<string>>>,
): MappedExhibition[] {
	const exhibitions: MappedExhibition[] = []
	for (const rawValue of asArray(value)) {
		const raw = asRecord(rawValue)
		const id = normalizedText(raw?._id)
		if (!id) continue
		const image = resolvedImage(raw?.image)
		const translated = uniqueTranslations(raw?.translations)
		const translations: Partial<Record<Language, MappedExhibitionTranslation>> = {}
		let dates: ReturnType<typeof checkExhibitionCompleteness>['dates']
		for (const language of LANGUAGES) {
			const translation = translated[language]
			if (!translation) continue
			const completeness = checkExhibitionCompleteness({
				startDate: raw?.startDate,
				endDate: raw?.endDate,
				image: image ? { assetId: image.assetId } : undefined,
				artworkIds: raw?.artworkIds,
				seriesIds: raw?.seriesIds,
				translation,
			})
			if (!completeness.complete || !completeness.dates) continue
			const title = normalizedText(translation.title)
			const venue = normalizedText(translation.venue)
			if (!title || !venue) continue
			dates = completeness.dates
			translations[language] = {
				title,
				venue,
				...(completeness.optional.image ? { image: completeness.optional.image } : {}),
				artworkIds: filterVisibleRelations(
					completeness.optional.artworkIds,
					language,
					visibleArtworkIds,
				),
				seriesIds: filterVisibleRelations(
					completeness.optional.seriesIds,
					language,
					visibleSeriesIds,
				),
			}
		}
		if (!translations.es || !dates) continue
		exhibitions.push({ id, ...dates, translations })
	}
	return exhibitions
}

function mapCriticalTexts(
	value: unknown,
	visibleArtworkIds: Partial<Record<Language, ReadonlySet<string>>>,
	visibleSeriesIds: Partial<Record<Language, ReadonlySet<string>>>,
): MappedCriticalText[] {
	const criticalTexts: MappedCriticalText[] = []
	for (const rawValue of asArray(value)) {
		const raw = asRecord(rawValue)
		const id = normalizedText(raw?._id)
		if (!id) continue
		const translations = uniqueTranslations(raw?.translations)
		const result = checkCriticalTextCompleteness({
			originalLanguage: raw?.originalLanguage,
			translations,
			artworkIds: raw?.artworkIds,
			seriesIds: raw?.seriesIds,
		})
		if (!result.complete || !result.originalLanguage) continue

		const mappedTranslations: Partial<Record<Language, MappedCriticalTextTranslation>> = {}
		for (const language of LANGUAGES) {
			const translation = result.translations[language]
			if (!translation) continue
			mappedTranslations[language] = {
				...translation,
				artworkIds: filterVisibleRelations(
					result.optional.artworkIds,
					language,
					visibleArtworkIds,
				),
				seriesIds: filterVisibleRelations(
					result.optional.seriesIds,
					language,
					visibleSeriesIds,
				),
			}
		}
		mappedTranslations[result.originalLanguage] && criticalTexts.push({
			id,
			originalLanguage: result.originalLanguage,
			translations: mappedTranslations,
		})
	}
	return criticalTexts
}

function uniqueTranslations(
	value: unknown,
): Partial<Record<Language, Record<string, unknown>>> {
	const byLanguage: Partial<Record<Language, Record<string, unknown>>> = {}
	const duplicateLanguages = new Set<Language>()
	for (const rawValue of asArray(value)) {
		const translation = asRecord(rawValue)
		if (!translation || !isLanguage(translation.language)) continue
		const language = translation.language
		if (byLanguage[language]) duplicateLanguages.add(language)
		else byLanguage[language] = translation
	}
	for (const language of duplicateLanguages) delete byLanguage[language]
	return byLanguage
}

function resolvedImage(
	value: unknown,
): { assetId: string; projection: SanityImageProjection } | undefined {
	const image = asRecord(value)
	const asset = asRecord(image?.asset)
	const assetId = normalizedText(asset?._id)
	const metadata = asRecord(asset?.metadata)
	const dimensions = asRecord(metadata?.dimensions)
	const width = dimensions?.width
	const height = dimensions?.height
	if (!assetId || !isPositiveInteger(width) || !isPositiveInteger(height)) return undefined
	const crop = imageCrop(image?.crop)
	const hotspot = imageHotspot(image?.hotspot)

	const projection: SanityImageProjection = {
		asset: { _id: assetId, metadata: { dimensions: { width, height } } },
		...(crop ? { crop } : {}),
		...(hotspot ? { hotspot } : {}),
	}
	return { assetId, projection }
}

function imageCrop(value: unknown): SanityImageProjection['crop'] {
	const crop = asRecord(value)
	if (!crop || !['top', 'bottom', 'left', 'right'].every((key) => isUnitInterval(crop[key]))) {
		return undefined
	}
	return {
		top: crop.top as number,
		bottom: crop.bottom as number,
		left: crop.left as number,
		right: crop.right as number,
	}
}

function imageHotspot(value: unknown): SanityImageProjection['hotspot'] {
	const hotspot = asRecord(value)
	if (!hotspot || !['x', 'y', 'width', 'height'].every((key) => isUnitInterval(hotspot[key]))) {
		return undefined
	}
	return {
		x: hotspot.x as number,
		y: hotspot.y as number,
		width: hotspot.width as number,
		height: hotspot.height as number,
	}
}

function isPositiveInteger(value: unknown): value is number {
	return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isUnitInterval(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}

function seriesIdsByLanguage(
	series: readonly SeriesCandidate[],
): Partial<Record<Language, ReadonlySet<string>>> {
	return idsByLanguage(series.map(({ content }) => content))
}

function visibleArtworkRelationsByLanguage(
	artworks: readonly ArtworkCandidate[],
): Partial<Record<Language, readonly { seriesId: string }[]>> {
	const result: Partial<Record<Language, { seriesId: string }[]>> = {}
	for (const { content, relationSeriesId } of artworks) {
		for (const language of LANGUAGES) {
			if (!content.translations[language]) continue
			(result[language] ??= []).push({ seriesId: relationSeriesId })
		}
	}
	return result
}

function idsByLanguage(
	entities: readonly { id: string; translations: Partial<Record<Language, unknown>> }[],
): Partial<Record<Language, ReadonlySet<string>>> {
	const ids: Partial<Record<Language, Set<string>>> = {}
	for (const entity of entities) {
		for (const language of LANGUAGES) {
			if (!entity.translations[language]) continue
			(ids[language] ??= new Set()).add(entity.id)
		}
	}
	return ids
}

function filterTranslations<T>(
	translations: Partial<Record<Language, T>>,
	include: (language: Language) => boolean,
): Partial<Record<Language, T>> {
	const filtered: Partial<Record<Language, T>> = {}
	for (const language of LANGUAGES) {
		const translation = translations[language]
		if (translation && include(language)) filtered[language] = translation
	}
	return filtered
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: undefined
}

function asArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : []
}

function normalizedText(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined
	const text = value.trim()
	return text || undefined
}

function isLanguage(value: unknown): value is Language {
	return value === 'es' || value === 'en'
}
