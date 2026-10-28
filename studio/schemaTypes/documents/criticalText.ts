import { defineField, defineType } from 'sanity'
import { createReferenceListField } from '../fields'
import { isEditorialLanguage, isEmptyValue, validationMessages,hasRequiredText } from '../validation'

export const criticalTextType = defineType({
  name: 'criticalText',
  title: 'Texto crítico',
  type: 'document',
  fields: [
        defineField({
      name: 'referenceName',
      title: 'Nombre interno de referencia',
      description: 'Solo para identificar la serie en Sanity; no se muestra en la web.',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
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
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isEditorialLanguage(value) || validationMessages.language,
      ),
    }),
    createReferenceListField('artworkIds', 'Obras relacionadas', ['artwork']),
    createReferenceListField('seriesIds', 'Series relacionadas', ['series']),
  ],
})
