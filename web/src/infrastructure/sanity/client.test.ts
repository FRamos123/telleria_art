import { describe, expect, it } from 'vitest'
import { createBuildSanityClient } from './client'

describe('createBuildSanityClient', () => {
	it('uses the published perspective without a credential', () => {
		const client = createBuildSanityClient({ projectId: 'project-id', dataset: 'development' })

		expect(client.config()).toMatchObject({
			projectId: 'project-id',
			dataset: 'development',
			apiVersion: '2025-02-19',
			perspective: 'published',
			useCdn: true,
		})
		expect(client.config()).not.toHaveProperty('token')
	})

	it('rejects missing project or dataset configuration', () => {
		expect(() => createBuildSanityClient({ projectId: '', dataset: 'development' })).toThrow(
			'project ID and dataset',
		)
		expect(() => createBuildSanityClient({ projectId: 'project-id', dataset: '' })).toThrow(
			'project ID and dataset',
		)
	})
})
