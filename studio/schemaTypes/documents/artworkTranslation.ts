import { defineField, defineType } from 'sanity'
import { createLocalizedImageAltField, createReferenceField } from '../fields'
import { hasRequiredText, isEditorialLanguage, isEmptyValue, validationMessages } from '../validation'

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
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isEditorialLanguage(value) || validationMessages.language,
      ),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'technique',
      title: 'Técnica',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'support',
      title: 'Soporte',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    createLocalizedImageAltField('altText', 'Texto alternativo', 'title', true),
    defineField({
      name: 'workshopNote',
      title: 'Nota del cuaderno de taller',
      type: 'text',
    }),
  ],
})
