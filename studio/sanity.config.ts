import { defineConfig } from 'sanity'
import { structureTool, type StructureResolver } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const SITE_SETTINGS_TYPE = 'siteSettings'

/** Single global settings document, excluded from document type listings and the create menu. */
const structureWithGlobalSettings: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración global')
        .child(S.document().schemaType(SITE_SETTINGS_TYPE).documentId('siteSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => listItem.getId() !== SITE_SETTINGS_TYPE),
    ])

export default defineConfig({
  name: 'default',
  title: 'AF Tellería — Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'local-project',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'local',
  plugins: [structureTool({ structure: structureWithGlobalSettings })],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (previous) => previous.filter(
      (option) => option.templateId !== SITE_SETTINGS_TYPE,
    ),
  },
})
