import type { PublicationLanguage } from '../../src/domain/publication'

/** Checks membership in the published-artwork snapshot bundled with this deployment. */
export function isPublishedArtworkId(
	index: unknown,
	artworkId: string,
	language: PublicationLanguage,
): boolean {
	if (typeof index !== 'object' || index === null || Array.isArray(index)) return false

	const localizedIds = (index as Record<string, unknown>)[language]
	return Array.isArray(localizedIds)
		&& localizedIds.some((candidate: unknown) => candidate === artworkId)
}
