import { defineField, defineType } from 'sanity'
import { createDimensions } from '../../../src/domain/dimensions'

export const dimensionsType = defineType({
  name: 'dimensions',
  title: 'Dimensiones (cm)',
  type: 'object',
  fields: [
    defineField({
      name: 'heightCm',
      title: 'Alto (cm)',
      type: 'number',
    }),
    defineField({
      name: 'widthCm',
      title: 'Ancho (cm)',
      type: 'number',
    }),
  ],
  validation: (Rule) => Rule.custom((value) => {
    const dimensions = value as { heightCm?: unknown; widthCm?: unknown } | undefined
    return createDimensions(dimensions?.heightCm, dimensions?.widthCm)
      ? true
      : 'Indica alto y ancho positivos, con un máximo de un decimal.'
  }),
})

export const dimensionsField = defineField({
  name: 'dimensions',
  title: 'Dimensiones (cm)',
  type: 'dimensions',
})
