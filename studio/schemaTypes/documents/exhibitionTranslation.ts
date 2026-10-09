import { defineField, defineType } from 'sanity'
import {
  createLocalizedImageAltField,
  createReferenceField,
} from '../fields'
import { hasRequiredText, isEditorialLanguage, isEmptyValue, validationMessages } from '../validation'

export const exhibitionTranslationType = defineType({
  name: 'exhibitionTranslation',
  title: 'Traducción de exposición',
  type: 'document',
  fields: [
    createReferenceField('exhibition', 'Exposición', ['exhibition'], true),
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
      name: 'venue',
      title: 'Lugar',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    createLocalizedImageAltField('imageAlt', 'Texto alternativo de la imagen', 'title'),
  ],
})
