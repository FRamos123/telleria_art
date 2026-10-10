import { describe, expect, it } from 'vitest';
import { createImageSitemapXml } from './image-sitemap';
import type { SanityImageProjection } from './sanity/image-url';

const artworkProjection: SanityImageProjection = {
	asset: { _id: 'image-artwork-640x480-jpg', metadata: { dimensions: { width: 640, height: 480 } } },
};
const seriesProjection: SanityImageProjection = {
	asset: { _id: 'image-series-1200x800-jpg', metadata: { dimensions: { width: 1200, height: 800 } } },
};

describe('createImageSitemapXml', () => {
	it('includes transformed images for visible artworks and valid series images only', () => {
		const xml = createImageSitemapXml({
			artworks: [{ id: 'artwork-1', mainImage: { projection: artworkProjection } }],
			series: [{ id: 'series-valid' }, { id: 'series-no-image' }, { id: 'series-invalid-image' }],
			seriesImageProjections: new Map([
				['series-valid', seriesProjection],
				['series-invalid-image', {
					...seriesProjection,
					crop: { top: 1, bottom: 1, left: 0, right: 0 },
				}],
			]),
		}, new URL('https://example.com'), { projectId: 'project', dataset: 'development' });

		expect(xml).toContain('<loc>https://example.com/obra/artwork-1/</loc>');
		expect(xml).toContain('<image:loc>https://cdn.sanity.io/images/project/development/artwork-640x480.jpg?');
		expect(xml).toContain('fm=webp');
		expect(xml).toContain('<loc>https://example.com/series/series-valid/</loc>');
		expect(xml).toContain('series-1200x800.jpg');
		expect(xml).not.toContain('series-no-image');
		expect(xml).not.toContain('series-invalid-image');
	});

	it('emits a valid empty image sitemap when there are no visible image entries', () => {
		const xml = createImageSitemapXml({
			artworks: [],
			series: [{ id: 'series-without-valid-image' }],
			seriesImageProjections: new Map(),
		}, new URL('https://example.com'), { projectId: 'project', dataset: 'development' });

		expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
		expect(xml).toContain('<urlset');
		expect(xml).toContain('</urlset>');
		expect(xml).not.toContain('<url>');
	});
});
