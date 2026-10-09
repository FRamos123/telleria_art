import { createClient, type SanityClient } from '@sanity/client'

const SANITY_API_VERSION = '2025-02-19'

export interface BuildSanityConfig {
	projectId: string
	dataset: string
}

export function createBuildSanityClient({ projectId, dataset }: BuildSanityConfig): SanityClient {
	if (!projectId.trim() || !dataset.trim()) {
		throw new Error('Sanity project ID and dataset are required for a build query.')
	}

	return createClient({
		projectId,
		dataset,
		apiVersion: SANITY_API_VERSION,
		useCdn: true,
		perspective: 'published',
	})
}

export function getBuildSanityClient(): SanityClient {
	return createBuildSanityClient({
		projectId: import.meta.env.SANITY_PROJECT_ID ?? '',
		dataset: import.meta.env.SANITY_DATASET ?? '',
	})
}
