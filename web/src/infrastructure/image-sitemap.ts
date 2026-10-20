import { createResponsiveImage, type ResponsiveImageOptions, type SanityImageProjection } from './sanity/image-url';
import type { Locale } from '../i18n';

interface ImageSitemapArtwork {
	id: string;
	mainImage: { projection: SanityImageProjection };
}

interface ImageSitemapSeries {
	id: string;
}

interface ImageSitemapExhibition {
	id: string;
	translations: Partial<Record<Locale, { image?: { assetId: string } }>>;
}

export interface ImageSitemapContent {
	artworks: readonly ImageSitemapArtwork[];
	series: readonly ImageSitemapSeries[];
	seriesImageProjections: ReadonlyMap<string, SanityImageProjection>;
	exhibitions: readonly ImageSitemapExhibition[];
	exhibitionImageProjections: ReadonlyMap<string, SanityImageProjection>;
}

interface ImageSitemapEntry {
	pagePath: string;
	imageUrl: string;
}

export function createImageSitemapXml(
	content: ImageSitemapContent,
	siteUrl: URL,
	imageOptions: ResponsiveImageOptions,
): string {
	const entries: ImageSitemapEntry[] = content.artworks.map((artwork) => ({
		pagePath: `/obra/${encodeURIComponent(artwork.id)}/`,
		imageUrl: createResponsiveImage(artwork.mainImage.projection, imageOptions).src,
	}));

	for (const series of content.series) {
		const projection = content.seriesImageProjections.get(series.id);
		if (!projection) continue;

		try {
			entries.push({
				pagePath: `/series/${encodeURIComponent(series.id)}/`,
				imageUrl: createResponsiveImage(projection, imageOptions).src,
			});
		} catch {
			// A series image is optional; invalid projections are omitted without blocking the sitemap.
		}
	}

	for (const exhibition of content.exhibitions) {
		const projection = content.exhibitionImageProjections.get(exhibition.id);
		if (!projection) continue;

		for (const locale of ['es', 'en'] as const) {
			const image = exhibition.translations[locale]?.image;
			if (!image || image.assetId !== projection.asset._id) continue;

			const pagePath = locale === 'es'
				? `/exposiciones/${encodeURIComponent(exhibition.id)}/`
				: `/en/exhibitions/${encodeURIComponent(exhibition.id)}/`;
			try {
				entries.push({
					pagePath,
					imageUrl: createResponsiveImage(projection, imageOptions).src,
				});
			} catch {
				// Exhibition images are optional; invalid projections must not block the sitemap.
			}
		}
	}

	const urls = entries
		.sort((first, second) => first.pagePath.localeCompare(second.pagePath))
		.map(({ pagePath, imageUrl }) => [
			'  <url>',
			`    <loc>${escapeXml(new URL(pagePath, siteUrl).href)}</loc>`,
			'    <image:image>',
			`      <image:loc>${escapeXml(imageUrl)}</image:loc>`,
			'    </image:image>',
			'  </url>',
		].join('\n'))
		.join('\n');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
		urls,
		'</urlset>',
	].filter(Boolean).join('\n');
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
