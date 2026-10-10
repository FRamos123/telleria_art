import { describe, expect, it } from 'vitest'

const currentYear = 2026
const mapperModulePath = './mappers' as string

const image = (id: string) => ({
	asset: {
		_id: id,
		url: `https://cdn.sanity.io/images/project/dataset/${id}.jpg`,
		metadata: { dimensions: { width: 1200, height: 1600 } },
	},
	crop: { top: 0, bottom: 0, left: 0, right: 0 },
	hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
})

function validQueryResults() {
	return {
		artworks: [
			{
				_id: 'artwork-1',
				seriesId: 'series-1',
				criticalTextIds: ['critical-1'],
				mainImage: image('artwork-image-1'),
				year: 2024,
				dimensions: { heightCm: 60, widthCm: 45 },
				inventoryNumber: 'AFT-2024-001',
				availability: 'disponible',
				workshopNote: '  Apunte de taller  ',
				translations: [
					{
						_id: 'artwork-1-es',
						language: 'es',
						title: 'Figura en reposo',
						technique: 'Óleo',
						support: 'Lienzo',
						altText: 'Figura sentada sobre fondo oscuro',
					},
					{
						_id: 'artwork-1-en',
						language: 'en',
						title: 'Figure at rest',
						technique: 'Oil',
						support: 'Canvas',
						altText: 'Seated figure against a dark background',
					},
				],
			},
		],
		series: [
			{
				_id: 'series-1',
				image: image('series-image-1'),
				translations: [
					{
						_id: 'series-1-es',
						language: 'es',
						name: 'Interiores',
						description: 'Estudios de interiores.',
						imageAlt: 'Interior con figura',
					},
					{
						_id: 'series-1-en',
						language: 'en',
						name: 'Interiors',
						description: 'Studies of interiors.',
						imageAlt: 'Interior with a figure',
					},
				],
			},
		],
		exhibitions: [
			{
				_id: 'exhibition-1',
				startDate: '2024-05-02',
				endDate: '2024-06-15',
				image: image('exhibition-image-1'),
				artworkIds: ['artwork-1'],
				seriesIds: ['series-1'],
				translations: [
					{
						_id: 'exhibition-1-es',
						language: 'es',
						title: 'Pintura reciente',
						venue: 'Vigo',
						imageAlt: 'Sala de exposición',
					},
					{
						_id: 'exhibition-1-en',
						language: 'en',
						title: 'Recent paintings',
						venue: 'Vigo',
						imageAlt: 'Exhibition room',
					},
				],
			},
		],
		criticalTexts: [
			{
				_id: 'critical-1',
				originalLanguage: 'es',
				artworkIds: ['artwork-1'],
				seriesIds: ['series-1'],
				translations: [
					{
						_id: 'critical-1-es',
						language: 'es',
						title: 'La figura y el espacio',
						body: 'Texto crítico en español.',
						author: 'Autora de prueba',
					},
					{
						_id: 'critical-1-en',
						language: 'en',
						title: 'The figure and the space',
						body: 'Critical text in English.',
						author: 'Test author',
					},
				],
			},
		],
	}
}

async function mapResults(input: ReturnType<typeof validQueryResults>) {
	const mapperModule = await import(/* @vite-ignore */ mapperModulePath)
	return mapperModule.mapSanityContent(input, currentYear)
}

describe('Sanity GROQ result mappers', () => {
	it('maps complete published documents and translations without changing editorial values', async () => {
		const catalog = await mapResults(validQueryResults())

		expect(catalog.artworks).toHaveLength(1)
		expect(catalog.artworks[0]).toMatchObject({
			id: 'artwork-1',
			year: 2024,
			heightCm: 60,
			widthCm: 45,
			inventoryNumber: 'AFT-2024-001',
				availability: 'disponible',
				seriesId: 'series-1',
				mainImage: {
					assetId: 'artwork-image-1',
					projection: {
						asset: {
							_id: 'artwork-image-1',
							metadata: { dimensions: { width: 1200, height: 1600 } },
						},
						crop: { top: 0, bottom: 0, left: 0, right: 0 },
						hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
					},
				},
			translations: {
				es: { title: 'Figura en reposo', technique: 'Óleo', support: 'Lienzo' },
				en: { title: 'Figure at rest', technique: 'Oil', support: 'Canvas' },
			},
			optional: { criticalTextIds: ['critical-1'] },
		})
		expect(catalog.series[0]).toMatchObject({
			id: 'series-1',
			translations: {
				es: { name: 'Interiores', description: 'Estudios de interiores.' },
				en: { name: 'Interiors', description: 'Studies of interiors.' },
			},
		})
		expect(catalog.exhibitions[0]).toMatchObject({
			id: 'exhibition-1',
			startDate: '2024-05-02',
			endDate: '2024-06-15',
			translations: {
				es: { title: 'Pintura reciente', venue: 'Vigo' },
				en: { title: 'Recent paintings', venue: 'Vigo' },
			},
		})
		expect(catalog.criticalTexts[0]).toMatchObject({
			id: 'critical-1',
			originalLanguage: 'es',
			translations: {
				es: { title: 'La figura y el espacio', author: 'Autora de prueba' },
				en: { title: 'The figure and the space', author: 'Test author' },
			},
		})
	})

	it('blocks artworks in both languages when the Spanish series translation is absent or incomplete', async () => {
		const missingSpanish = validQueryResults()
		missingSpanish.series[0]!.translations = [missingSpanish.series[0]!.translations[1]!]
		const incompleteSpanish = validQueryResults()
		incompleteSpanish.series[0]!.translations[0]!.name = '   '

		const withoutSpanishSeries = await mapResults(missingSpanish)
		const withIncompleteSpanishSeries = await mapResults(incompleteSpanish)

		expect(withoutSpanishSeries.artworks).toEqual([])
		expect(withIncompleteSpanishSeries.artworks).toEqual([])
		expect(withoutSpanishSeries.series).toEqual([])
		expect(withIncompleteSpanishSeries.series).toEqual([])
	})

	it('keeps Spanish artworks but removes English when the English series translation is absent or incomplete', async () => {
		const missingEnglish = validQueryResults()
		missingEnglish.series[0]!.translations = [missingEnglish.series[0]!.translations[0]!]
		const incompleteEnglish = validQueryResults()
		incompleteEnglish.series[0]!.translations[1]!.name = '   '

		for (const input of [missingEnglish, incompleteEnglish]) {
			const catalog = await mapResults(input)
			expect(catalog.artworks).toHaveLength(1)
			expect(catalog.artworks[0]?.translations).toHaveProperty('es')
			expect(catalog.artworks[0]?.translations).not.toHaveProperty('en')
			expect(catalog.series[0]?.translations).toHaveProperty('es')
			expect(catalog.series[0]?.translations).not.toHaveProperty('en')
		}
	})

	it('keeps both artwork versions when both localized series translations are valid', async () => {
		const catalog = await mapResults(validQueryResults())

		expect(catalog.artworks[0]?.translations).toHaveProperty('es')
		expect(catalog.artworks[0]?.translations).toHaveProperty('en')
		expect(catalog.series[0]?.translations).toHaveProperty('es')
		expect(catalog.series[0]?.translations).toHaveProperty('en')
	})

	it('maps Spanish and English workshop notes independently', async () => {
		const input = validQueryResults()
		Object.assign(input.artworks[0]!.translations[0]!, { workshopNote: '  Nota en español  ' })
		Object.assign(input.artworks[0]!.translations[1]!, { workshopNote: '  Note in English  ' })

		const artwork = (await mapResults(input)).artworks[0]

		expect(artwork?.translations.es).toMatchObject({ workshopNote: 'Nota en español' })
		expect(artwork?.translations.en).toMatchObject({ workshopNote: 'Note in English' })
		expect(artwork?.optional).not.toHaveProperty('workshopNote')
	})

	it('does not fall back from a Spanish note or the unconfirmed legacy value to English', async () => {
		const input = validQueryResults()
		Object.assign(input.artworks[0]!.translations[0]!, { workshopNote: 'Nota solo en español' })

		const artwork = (await mapResults(input)).artworks[0]

		expect(artwork?.translations.es).toMatchObject({ workshopNote: 'Nota solo en español' })
		expect(artwork?.translations.en).not.toHaveProperty('workshopNote')
		expect(artwork?.optional).not.toHaveProperty('workshopNote')
	})

	it('omits blank and missing localized workshop notes', async () => {
		const input = validQueryResults()
		Object.assign(input.artworks[0]!.translations[0]!, { workshopNote: '  ' })

		const artwork = (await mapResults(input)).artworks[0]

		expect(artwork?.translations.es).not.toHaveProperty('workshopNote')
		expect(artwork?.translations.en).not.toHaveProperty('workshopNote')
		expect(artwork?.optional).not.toHaveProperty('workshopNote')
	})

	it('drops artworks with a missing series reference or required image asset', async () => {
		const missingSeries = validQueryResults()
		missingSeries.artworks[0]!.seriesId = ''
		const missingAsset = validQueryResults()
		missingAsset.artworks[0]!.mainImage.asset = null as never

		expect((await mapResults(missingSeries)).artworks).toEqual([])
		expect((await mapResults(missingAsset)).artworks).toEqual([])
	})

	it('omits incomplete localized versions without fallback and allows an English-only original critical text', async () => {
		const incompleteEnglish = validQueryResults()
		incompleteEnglish.artworks[0]!.translations[1]!.support = '   '
		const incompleteSpanish = validQueryResults()
		incompleteSpanish.artworks[0]!.translations[0]!.altText = 'Figura en reposo'
		const englishOriginal = validQueryResults()
		englishOriginal.criticalTexts[0]!.originalLanguage = 'en'
		englishOriginal.criticalTexts[0]!.translations = [
			englishOriginal.criticalTexts[0]!.translations[1]!,
		]

		const withoutEnglish = (await mapResults(incompleteEnglish)).artworks[0]
		expect(withoutEnglish?.translations).toHaveProperty('es')
		expect(withoutEnglish?.translations).not.toHaveProperty('en')
		expect((await mapResults(incompleteSpanish)).artworks).toEqual([])

		const criticalText = (await mapResults(englishOriginal)).criticalTexts[0]
		expect(criticalText?.originalLanguage).toBe('en')
		expect(criticalText?.translations).toHaveProperty('en')
		expect(criticalText?.translations).not.toHaveProperty('es')
	})

	it('normalizes invalid optional notes and images to absent without dropping their documents', async () => {
		const input = validQueryResults()
		input.artworks[0]!.workshopNote = '  '
		input.artworks[0]!.criticalTextIds = [null, '', 42] as never
		input.series[0]!.image = { asset: null } as never
		input.exhibitions[0]!.image = image('exhibition-image-1')
		input.exhibitions[0]!.translations[0]!.imageAlt = 'Pintura reciente'

		const catalog = await mapResults(input)
		expect(catalog.artworks).toHaveLength(1)
		expect(catalog.artworks[0]?.optional).toEqual({})
		expect(catalog.series).toHaveLength(1)
		expect(catalog.series[0]).not.toHaveProperty('image')
		expect(catalog.exhibitions).toHaveLength(1)
		expect(catalog.exhibitions[0]?.translations.es).not.toHaveProperty('image')
	})

	it('keeps only visible relationships in each language and hides series without visible artworks', async () => {
		const input = validQueryResults()
		input.exhibitions[0]!.artworkIds = ['artwork-1', 'missing-artwork']
		input.exhibitions[0]!.seriesIds = ['series-1', 'missing-series']
		input.criticalTexts[0]!.artworkIds = ['artwork-1', 'missing-artwork']
		input.criticalTexts[0]!.seriesIds = ['series-1', 'missing-series']
		const catalog = await mapResults(input)

		expect(catalog.exhibitions[0]?.translations.es).toMatchObject({
			artworkIds: ['artwork-1'],
			seriesIds: ['series-1'],
		})
		expect(catalog.criticalTexts[0]?.translations.es).toMatchObject({
			artworkIds: ['artwork-1'],
			seriesIds: ['series-1'],
		})

		input.artworks = []
		const withoutVisibleArtwork = await mapResults(input)
		expect(withoutVisibleArtwork.series).toEqual([])
		expect(withoutVisibleArtwork.exhibitions[0]?.translations.es).toMatchObject({
			artworkIds: [],
			seriesIds: [],
		})
	})

	it.each([
		['year', 1899],
		['heightCm', 0],
		['widthCm', 45.55],
		['inventoryNumber', 'AFT-1899-001'],
		['availability', 'unknown'],
	])('rejects an artwork with malformed required %s value', async (field, value) => {
		const input = validQueryResults()
		if (field === 'heightCm' || field === 'widthCm') {
			input.artworks[0]!.dimensions[field] = value as number
		} else {
			Object.assign(input.artworks[0], { [field]: value })
		}

		expect((await mapResults(input)).artworks).toEqual([])
	})

	it('rejects invalid required exhibition dates and invalid critical-text originals', async () => {
		const invalidDates = validQueryResults()
		invalidDates.exhibitions[0]!.startDate = '2024-02-30'
		const invalidCriticalText = validQueryResults()
		invalidCriticalText.criticalTexts[0]!.originalLanguage = 'fr' as never

		expect((await mapResults(invalidDates)).exhibitions).toEqual([])
		expect((await mapResults(invalidCriticalText)).criticalTexts).toEqual([])
	})

	it('blocks a catalog containing duplicate inventory numbers', async () => {
		const input = validQueryResults()
		input.artworks.push({
			...input.artworks[0]!,
			_id: 'artwork-2',
			translations: input.artworks[0]!.translations.map((translation) => ({
				...translation,
				_id: `${translation._id}-copy`,
			})),
		})

		await expect(mapResults(input)).rejects.toThrow(
			/AFT-2024-001.*artwork-1.*artwork-2/,
		)
	})

	it('omits an ambiguous language instead of choosing between duplicate translations', async () => {
		const input = validQueryResults()
		input.artworks[0]!.translations.push({
			...input.artworks[0]!.translations[1]!,
			_id: 'artwork-1-en-duplicate',
			title: 'Another English title',
		})

		const artwork = (await mapResults(input)).artworks[0]
		expect(artwork?.translations).toHaveProperty('es')
		expect(artwork?.translations).not.toHaveProperty('en')
	})
})
