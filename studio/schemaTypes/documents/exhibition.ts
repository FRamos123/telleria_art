import { defineField, defineType } from 'sanity'
import {
  createEditorialImageField,
  createReferenceListField,
} from '../fields'

export const exhibitionType = defineType({
  name: 'exhibition',
  title: 'Exposición',
  type: 'document',
  fields: [
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
    }),
    createEditorialImageField('image', 'Imagen de la exposición'),
    createReferenceListField('artworkIds', 'Obras relacionadas', ['artwork']),
    createReferenceListField('seriesIds', 'Series relacionadas', ['series']),
  ],
})
