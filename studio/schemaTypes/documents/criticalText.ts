import { defineField, defineType } from 'sanity'
import { createReferenceListField } from '../fields'

export const criticalTextType = defineType({
  name: 'criticalText',
  title: 'Texto crítico',
  type: 'document',
  fields: [
    defineField({
      name: 'originalLanguage',
      title: 'Idioma original',
      type: 'string',
      options: {
        list: [
          { title: 'Español (ES)', value: 'es' },
          { title: 'Inglés (EN)', value: 'en' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    createReferenceListField('artworkIds', 'Obras relacionadas', ['artwork']),
    createReferenceListField('seriesIds', 'Series relacionadas', ['series']),
  ],
})
