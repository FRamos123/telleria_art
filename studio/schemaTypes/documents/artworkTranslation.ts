import { defineField, defineType } from 'sanity'
import { createLocalizedImageAltField, createReferenceField } from '../fields'

export const artworkTranslationType = defineType({
  name: 'artworkTranslation',
  title: 'Traducción de obra',
  type: 'document',
  fields: [
    createReferenceField('artwork', 'Obra', ['artwork'], true),
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      options: {
        list: [
          { title: 'Español (ES)', value: 'es' },
          { title: 'Inglés (EN)', value: 'en' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technique',
      title: 'Técnica',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'support',
      title: 'Soporte',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    createLocalizedImageAltField('altText', 'Texto alternativo', 'title', true),
  ],
})
