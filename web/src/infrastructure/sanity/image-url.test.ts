import { describe, expect, it } from 'vitest'

const imageUrlModulePath = './image-url' as string

const source = {
	asset: {
		_id: 'image-abc123-2400x1600-jpg',
		url: 'https://cdn.sanity.io/images/project/dataset/abc123-2400x1600.jpg',
		metadata: { dimensions: { width: 2400, height: 1600 } },
	},
	crop: { top: 0.1, bottom: 0.05, left: 0.2, right: 0.1 },
	hotspot: { x: 0.4, y: 0.6, width: 0.5, height: 0.4 },
}

const config = { projectId: 'project', dataset: 'dataset' }

interface TestImageOptions {
	projectId: string
	dataset: string
	aspectRatio?: number
}

async function createResponsiveImage(image = source, options: TestImageOptions = config) {
	const module = await import(/* @vite-ignore */ imageUrlModulePath)
	return module.createResponsiveImage(image, options)
}

describe('Sanity responsive image URLs', () => {
	it('creates WebP src and srcset variants no wider than 2000 pixels', async () => {
		const image = await createResponsiveImage()
		const variants = image.srcSet.split(', ').map((variant: string) => {
			const [url, descriptor] = variant.split(' ')
			return { url, width: Number.parseInt(descriptor ?? '', 10) }
		})

		expect(image.src).toContain('fm=webp')
		expect(variants.map(({ width }: { width: number }) => width)).toEqual([
			320, 640, 960, 1280, 1600, 1680,
		])
		expect(variants.every(({ url }: { url: string }) => url?.includes('fm=webp'))).toBe(true)
		expect(variants.every(({ width }: { width: number }) => width <= 2000)).toBe(true)
	})

	it('retains Sanity crop and hotspot framing in the generated image URLs', async () => {
		const framedSource = {
			...source,
			hotspot: { ...source.hotspot, x: 0.7 },
		}
		const image = await createResponsiveImage(framedSource, { ...config, aspectRatio: 1.1 })
		const withoutCrop = await createResponsiveImage({
			...framedSource,
			crop: { top: 0, bottom: 0, left: 0, right: 0 },
		}, { ...config, aspectRatio: 1.1 })
		const withoutHotspot = await createResponsiveImage({
			...framedSource,
			hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
		}, { ...config, aspectRatio: 1.1 })
		expect(image.src).not.toBe(withoutCrop.src)
		expect(image.src).not.toBe(withoutHotspot.src)
		expect(image.src).toContain('rect=')
	})

	it('returns explicit dimensions derived from the asset and caps variants to its width', async () => {
		const image = await createResponsiveImage({
			...source,
			asset: {
				...source.asset,
				metadata: { dimensions: { width: 800, height: 1200 } },
			},
			crop: { top: 0, bottom: 0, left: 0, right: 0 },
		})

		expect(image).toMatchObject({ width: 800, height: 1200 })
		expect(image.srcSet.split(', ').map((variant: string) =>
			Number.parseInt(variant.split(' ').at(-1) ?? '', 10),
		)).toEqual([320, 640, 800])
	})

	it('limits the longer served side to 2000 pixels for portrait assets', async () => {
		const image = await createResponsiveImage({
			...source,
			asset: {
				...source.asset,
				metadata: { dimensions: { width: 1600, height: 2400 } },
			},
			crop: { top: 0, bottom: 0, left: 0, right: 0 },
		})
		const widths = image.srcSet.split(', ').map((variant: string) =>
			Number.parseInt(variant.split(' ').at(-1) ?? '', 10),
		)

		expect(widths.at(-1)).toBe(1333)
		expect(widths.every((width: number) => width <= 2000)).toBe(true)
	})
})
