import { describe, expect, it } from 'vitest'
import { isPublishedArtworkId } from './contact-artwork'

describe('isPublishedArtworkId', () => {
	const deployedArtworkIndex = {
		es: ['artwork-kept-in-deployment', 'artwork-es-only'],
		en: ['artwork-kept-in-deployment', 'artwork-en-only'],
	}

	it('uses the deployed snapshot even if Sanity has changed after that deployment', () => {
		// Runtime validation receives the deployed artifact, not a live Sanity result.
		expect(isPublishedArtworkId(deployedArtworkIndex, 'artwork-kept-in-deployment', 'es'))
			.toBe(true)
	})

	it('rejects an artwork absent from the deployed snapshot', () => {
		expect(isPublishedArtworkId(deployedArtworkIndex, 'artwork-not-deployed', 'es'))
			.toBe(false)
	})

	it('requires the artwork to be included for the requested language', () => {
		expect(isPublishedArtworkId(deployedArtworkIndex, 'artwork-en-only', 'es')).toBe(false)
		expect(isPublishedArtworkId(deployedArtworkIndex, 'artwork-en-only', 'en')).toBe(true)
	})
})
