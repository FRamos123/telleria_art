import { defineField, defineType } from 'sanity'
import {
  createLocalizedImageAltField,
  createReferenceField,
} from '../fields'
import { hasRequiredText, isEditorialLanguage, isEmptyValue, validationMessages } from '../validation'

export const seriesTranslationType = defineType({
  name: 'seriesTranslation',
  title: 'Traducción de serie',
  type: 'document',
  fields: [
    createReferenceField('series', 'Serie', ['series'], true),
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
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'description',
      title: 'Descripción editorial',
      type: 'text',
    }),
    createLocalizedImageAltField('imageAlt', 'Texto alternativo de la imagen', 'name'),
  ],
})
