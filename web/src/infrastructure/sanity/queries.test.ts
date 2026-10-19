import { describe, expect, it } from 'vitest'
import { artworkQuery, criticalTextQuery, exhibitionQuery, seriesQuery, siteSettingsQuery } from './queries'

const queries = [artworkQuery, seriesQuery, exhibitionQuery, criticalTextQuery, siteSettingsQuery]

describe('published Sanity GROQ queries', () => {
	it.each([
		[artworkQuery, 'artwork', 'artworkTranslation'],
		[seriesQuery, 'series', 'seriesTranslation'],
		[exhibitionQuery, 'exhibition', 'exhibitionTranslation'],
		[criticalTextQuery, 'criticalText', 'criticalTextTranslation'],
	])('selects %s documents and their linked translations', (query, documentType, translationType) => {
		expect(query).toContain(`_type == "${documentType}"`)
		expect(query).toContain(`_type == "${translationType}"`)
		expect(query).toContain('references(^._id)')
		expect(query).toContain('language')
	})

	it('selects image assets and stable relation IDs', () => {
		expect(artworkQuery).toContain('asset->{_id, url, metadata{dimensions{width, height}}}')
		expect(artworkQuery).toContain('dimensions{heightCm, widthCm}')
		expect(seriesQuery).toContain('asset->{_id, url, metadata{dimensions{width, height}}}')
		expect(exhibitionQuery).toContain('artworkIds')
		expect(exhibitionQuery).toContain('seriesIds')
		expect(criticalTextQuery).toContain('artworkIds')
		expect(criticalTextQuery).toContain('seriesIds')
		expect(artworkQuery).toContain('criticalTextIds')
		expect(artworkQuery).toContain('seriesId')
	})

	it('projects workshop notes per translation and preserves the legacy artwork field', () => {
		const translationProjection = artworkQuery.match(
			/"translations": \*\[_type == "artworkTranslation" && references\(\^\._id\)\] \{([\s\S]*?)\n\t\}/,
		)?.[1]

		expect(artworkQuery).toContain('\n\tworkshopNote,\n\t"translations"')
		expect(translationProjection).toContain('\n\t\tworkshopNote')
	})

	it('projects the artist-authored SEO description per artwork translation', () => {
		const translationProjection = artworkQuery.match(
			/"translations": \*\[_type == "artworkTranslation" && references\(\^\._id\)\] \{([\s\S]*?)\n\t\}/,
		)?.[1]

		expect(translationProjection).toContain('\n\t\tseoDescription')
	})

	it('selects the published global settings singleton by its stable ID with only the catalog SEO fields', () => {
		expect(siteSettingsQuery).toContain('*[_id == "siteSettings"][0]')
		expect(siteSettingsQuery).toContain('catalogSeoDescriptionEs')
		expect(siteSettingsQuery).toContain('catalogSeoDescriptionEn')
		expect(siteSettingsQuery).not.toContain('artwork')
		expect(siteSettingsQuery).not.toContain('series')
	})

	it('contains no draft selectors or credentials', () => {
		for (const query of queries) {
			expect(query).not.toMatch(/drafts\.|_drafts|token/i)
		}
	})
})
