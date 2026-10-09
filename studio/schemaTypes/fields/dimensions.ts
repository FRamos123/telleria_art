import { defineField, defineType } from 'sanity'
import { createDimensions } from '../../../web/src/domain/dimensions'
import { isEmptyValue, isValidDimensionValue, validationMessages } from '../validation'

export const dimensionsType = defineType({
  name: 'dimensions',
  title: 'Dimensiones (cm)',
  type: 'object',
  fields: [
    defineField({
      name: 'heightCm',
      title: 'Alto (cm)',
      type: 'number',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isValidDimensionValue(value) || validationMessages.dimensions,
      ),
    }),
    defineField({
      name: 'widthCm',
      title: 'Ancho (cm)',
      type: 'number',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isValidDimensionValue(value) || validationMessages.dimensions,
      ),
    }),
  ],
  validation: (Rule) => Rule.custom((value) => {
    const dimensions = value as { heightCm?: unknown; widthCm?: unknown } | undefined
    return createDimensions(dimensions?.heightCm, dimensions?.widthCm)
      ? true
      : validationMessages.dimensions
  }),
})

export const dimensionsField = defineField({
  name: 'dimensions',
  title: 'Dimensiones (cm)',
  type: 'dimensions',
  validation: (Rule) => Rule.required(),
})
