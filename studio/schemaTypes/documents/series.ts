import { defineType } from 'sanity'
import { createEditorialImageField } from '../fields'

export const seriesType = defineType({
  name: 'series',
  title: 'Serie',
  type: 'document',
  fields: [
    createEditorialImageField('image', 'Imagen de la serie'),
  ],
})
