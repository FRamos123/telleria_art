import type { SanityClient } from '@sanity/client'
import type { SanityImageProjection } from './image-url'
import { mapSanityContent, type MappedSanityContent } from './mappers'
import { getBuildSanityClient } from './client'
import { artworkQuery, seriesQuery } from './queries'

export interface CatalogContent extends MappedSanityContent {
	seriesImageProjections: ReadonlyMap<string, SanityImageProjection>
}

/** Loads published artwork and series, then delegates visibility to the existing mapper. */
export async function loadCatalogContent(
	client: SanityClient = getBuildSanityClient(),
	currentYear = new Date().getFullYear(),
): Promise<CatalogContent> {
	const [artworks, series] = await Promise.all([
		client.fetch(artworkQuery),
		client.fetch(seriesQuery),
	])

	const mapped = mapSanityContent({ artworks, series }, currentYear)
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

	return { ...mapped, seriesImageProjections }
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
