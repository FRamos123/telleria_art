import { defineField, defineType } from 'sanity'
import {
  createEditorialImageField,
  createReferenceListField,
} from '../fields'
import { isEmptyValue, isValidExhibitionDateRange, validationMessages } from '../validation'

export const exhibitionType = defineType({
  name: 'exhibition',
  title: 'Exposición',
  type: 'document',
  fields: [
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      validation: (Rule) => Rule.required().custom((value, context) => {
        if (isEmptyValue(value)) return true
        const document = context.document as { endDate?: unknown } | undefined
        return isValidExhibitionDateRange(value, document?.endDate)
          || validationMessages.exhibitionDate
      }),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
      validation: (Rule) => Rule.custom((value, context) => {
        if (isEmptyValue(value)) return true
        const document = context.document as { startDate?: unknown } | undefined
        return isValidExhibitionDateRange(document?.startDate, value)
          || validationMessages.exhibitionDate
      }),
    }),
    createEditorialImageField('image', 'Imagen de la exposición'),
    createReferenceListField('artworkIds', 'Obras relacionadas', ['artwork']),
    createReferenceListField('seriesIds', 'Series relacionadas', ['series']),
  ],
})
