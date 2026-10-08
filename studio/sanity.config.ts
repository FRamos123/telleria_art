import { defineConfig } from 'sanity'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'AF Tellería — Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'local-project',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'local',
  schema: {
    types: schemaTypes,
  },
})
