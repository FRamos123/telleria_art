import { defineField, defineType } from 'sanity'
import {
  availabilityField,
  createEditorialImageField,
  createReferenceField,
  createReferenceListField,
  dimensionsField,
} from '../fields'

export const artworkType = defineType({
  name: 'artwork',
  title: 'Obra',
  type: 'document',
  fields: [
    createReferenceField('series', 'Serie', ['series'], true),
    createReferenceListField('criticalTextIds', 'Textos críticos relacionados', ['criticalText']),
    createEditorialImageField('mainImage', 'Imagen principal', true),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    dimensionsField,
    defineField({
      name: 'inventoryNumber',
      title: 'Número de inventario',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    availabilityField,
    defineField({
      name: 'workshopNote',
      title: 'Nota del cuaderno de taller',
      type: 'text',
    }),
  ],
})
