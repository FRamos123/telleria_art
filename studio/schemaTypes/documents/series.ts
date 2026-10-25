import { defineField, defineType } from 'sanity'
import { createEditorialImageField } from '../fields'
import { hasRequiredText, isEmptyValue, validationMessages } from '../validation'

export const seriesType = defineType({
  name: 'series',
  title: 'Serie',
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
    createEditorialImageField('image', 'Imagen de la serie'),
  ],
  preview: {
    select: {
      title: 'referenceName',
      media: 'image',
    },
  },
})
