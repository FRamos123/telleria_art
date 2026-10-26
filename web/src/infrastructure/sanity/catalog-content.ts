import type { SanityClient } from '@sanity/client'
import type { SanityImageProjection } from './image-url'
import { mapSanityContent, type MappedSanityContent } from './mappers'
import { getBuildSanityClient } from './client'
import {
	artworkQuery,
	criticalTextQuery,
	exhibitionQuery,
	seriesQuery,
	siteSettingsQuery,
} from './queries'
import type { PublicationLanguage } from '../../domain/publication'

export interface CatalogContent extends MappedSanityContent {
	exhibitionImageProjections: ReadonlyMap<string, SanityImageProjection>
	seriesImageProjections: ReadonlyMap<string, SanityImageProjection>
}

export type CatalogSeoDescriptions = Partial<Record<PublicationLanguage, string>>
export type HomeIntroductions = Partial<Record<PublicationLanguage, string>>

/** Loads published portfolio content, then delegates visibility to the existing mapper. */
export async function loadCatalogContent(
	client: SanityClient = getBuildSanityClient(),
	currentYear = new Date().getFullYear(),
): Promise<CatalogContent> {
	const [artworks, series, exhibitions, criticalTexts] = await Promise.all([
		client.fetch(artworkQuery),
		client.fetch(seriesQuery),
		client.fetch(exhibitionQuery),
		client.fetch(criticalTextQuery),
	])

	const mapped = mapSanityContent({ artworks, series, exhibitions, criticalTexts }, currentYear)
	const exhibitionImageProjections = new Map<string, SanityImageProjection>()
	for (const rawExhibition of asArray(exhibitions)) {
		const record = asRecord(rawExhibition)
		const id = normalizedText(record?._id)
		const visibleExhibition = id && mapped.exhibitions.find((candidate) => candidate.id === id)
		const projection = toImageProjection(record?.image)
		if (
			id
			&& visibleExhibition
			&& projection
			&& Object.values(visibleExhibition.translations).some(
				(translation) => translation?.image?.assetId === projection.asset._id,
			)
		) {
			exhibitionImageProjections.set(id, projection)
		}
	}

	const seriesImageProjections = new Map<string, SanityImageProjection>()
	for (const rawSeries of asArray(series)) {
		const record = asRecord(rawSeries)
		const id = normalizedText(record?._id)
		const visibleSeries = id && mapped.series.find((candidate) => candidate.id === id)
		const projection = toImageProjection(record?.image)
		if (
			id
			&& visibleSeries
			&& projection
			&& Object.values(visibleSeries.translations).some(
				(translation) => translation?.image?.assetId === projection.asset._id,
			)
		) {
			seriesImageProjections.set(id, projection)
		}
	}

	return { ...mapped, exhibitionImageProjections, seriesImageProjections }
}

/**
 * Loads the published global settings singleton and returns each language's approved
 * catalog SEO description. Unpublished or blank texts stay absent, with no fallback.
 */
export async function loadCatalogSeoDescriptions(
	client: SanityClient = getBuildSanityClient(),
): Promise<CatalogSeoDescriptions> {
	const settings = asRecord(await client.fetch(siteSettingsQuery))
	const descriptions: CatalogSeoDescriptions = {}
	const spanish = normalizedText(settings?.catalogSeoDescriptionEs)
	const english = normalizedText(settings?.catalogSeoDescriptionEn)
	if (spanish) descriptions.es = spanish
	if (english) descriptions.en = english
	return descriptions
}

/** Loads the optional artist-authored home introduction independently for each language. */
export async function loadHomeIntroductions(
	client: SanityClient = getBuildSanityClient(),
): Promise<HomeIntroductions> {
	const settings = asRecord(await client.fetch(siteSettingsQuery))
	const introductions: HomeIntroductions = {}
	const spanish = normalizedText(settings?.homeIntroductionEs)
	const english = normalizedText(settings?.homeIntroductionEn)
	if (spanish) introductions.es = spanish
	if (english) introductions.en = english
	return introductions
}

function toImageProjection(value: unknown): SanityImageProjection | undefined {
	const image = asRecord(value)
	const asset = asRecord(image?.asset)
	const metadata = asRecord(asset?.metadata)
	const dimensions = asRecord(metadata?.dimensions)
	const assetId = normalizedText(asset?._id)
	const width = dimensions?.width
	const height = dimensions?.height
	if (!assetId || !isPositiveInteger(width) || !isPositiveInteger(height)) return undefined

	const crop = asRecord(image?.crop)
	const validCrop = crop
		&& ['top', 'bottom', 'left', 'right'].every((key) => isUnitInterval(crop[key]))
		? {
			top: crop.top as number,
			bottom: crop.bottom as number,
			left: crop.left as number,
			right: crop.right as number,
		}
		: undefined
	const hotspot = asRecord(image?.hotspot)
	const validHotspot = hotspot
		&& ['x', 'y', 'width', 'height'].every((key) => isUnitInterval(hotspot[key]))
		? {
			x: hotspot.x as number,
			y: hotspot.y as number,
			width: hotspot.width as number,
			height: hotspot.height as number,
		}
		: undefined

	return {
		asset: { _id: assetId, metadata: { dimensions: { width, height } } },
		...(validCrop ? { crop: validCrop } : {}),
		...(validHotspot ? { hotspot: validHotspot } : {}),
	}
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

function isPositiveInteger(value: unknown): value is number {
	return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isUnitInterval(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}
