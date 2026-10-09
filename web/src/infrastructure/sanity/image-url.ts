import {
	createImageUrlBuilder,
	type SanityImageCrop,
	type SanityImageHotspot,
} from '@sanity/image-url'
import type { BuildSanityConfig } from './client'

const RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1600, 2000] as const
const MAX_IMAGE_WIDTH = 2000

export interface SanityImageProjection {
	asset: {
		_id: string
		metadata: {
			dimensions: {
				width: number
				height: number
			}
		}
	}
	crop?: SanityImageCrop
	hotspot?: SanityImageHotspot
}

export interface ResponsiveImageOptions extends BuildSanityConfig {
	/** Target width-to-height ratio, when the presentation needs a fixed crop. */
	aspectRatio?: number
}

export interface ResponsiveImage {
	src: string
	srcSet: string
	width: number
	height: number
}

/** Builds optimized WebP URLs while preserving the image's Sanity framing. */
export function createResponsiveImage(
	image: SanityImageProjection,
	options: ResponsiveImageOptions,
): ResponsiveImage {
	const { projectId, dataset, aspectRatio } = options
	const { _id: assetId, metadata } = image.asset
	const { width: assetWidth, height: assetHeight } = metadata.dimensions

	if (!projectId.trim() || !dataset.trim()) {
		throw new Error('Sanity project ID and dataset are required to build image URLs.')
	}
	if (!assetId.trim() || !isPositiveInteger(assetWidth) || !isPositiveInteger(assetHeight)) {
		throw new Error('Sanity image asset ID and positive pixel dimensions are required.')
	}
	if (aspectRatio !== undefined && (!Number.isFinite(aspectRatio) || aspectRatio <= 0)) {
		throw new Error('Image aspect ratio must be a positive finite number.')
	}

	const builder = createImageUrlBuilder({ projectId, dataset }).image({
		asset: { _id: assetId },
		...(image.crop ? { crop: image.crop } : {}),
		...(image.hotspot ? { hotspot: image.hotspot } : {}),
	})
	const widths = responsiveWidths(image, aspectRatio)
	const variants = widths.map((variantWidth) => {
		let variant = builder.width(variantWidth).format('webp')
		if (aspectRatio !== undefined) {
			variant = variant.height(Math.max(1, Math.round(variantWidth / aspectRatio)))
		}
		return { width: variantWidth, url: variant.url() }
	})
	const largestVariant = variants.at(-1)

	if (!largestVariant) {
		throw new Error('Sanity image asset must have a usable pixel width.')
	}

	return {
		src: largestVariant.url,
		srcSet: variants.map(({ url, width }) => `${url} ${width}w`).join(', '),
		width: assetWidth,
		height: assetHeight,
	}
}

function responsiveWidths(image: SanityImageProjection, aspectRatio?: number): number[] {
	const { width: assetWidth, height: assetHeight } = image.asset.metadata.dimensions
	const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 }
	const croppedWidth = assetWidth * (1 - crop.left - crop.right)
	const croppedHeight = assetHeight * (1 - crop.top - crop.bottom)
	const outputAspectRatio = aspectRatio ?? croppedWidth / croppedHeight
	const maximumWidth = Math.floor(Math.min(
		assetWidth,
		MAX_IMAGE_WIDTH,
		croppedWidth,
		croppedHeight * outputAspectRatio,
		MAX_IMAGE_WIDTH * outputAspectRatio,
	))

	if (!Number.isFinite(maximumWidth) || maximumWidth < 1) {
		throw new Error('Sanity image crop must leave positive pixel dimensions.')
	}

	return [...new Set([
		...RESPONSIVE_WIDTHS.filter((width) => width < maximumWidth),
		maximumWidth,
	])]
}

function isPositiveInteger(value: number): boolean {
	return Number.isInteger(value) && value > 0
}
