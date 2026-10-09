import { defineField, defineType } from 'sanity'
import { AVAILABILITY_VALUES, isAvailability } from '../../../web/src/domain/availability'
import { isEmptyValue } from '../validation'

export const availabilityType = defineType({
  name: 'availability',
  title: 'Disponibilidad del original',
  type: 'string',
  options: {
    list: AVAILABILITY_VALUES.map((value) => ({ title: value, value })),
  },
  validation: (Rule) => Rule.required().custom((value) =>
    isEmptyValue(value) || isAvailability(value) || 'Selecciona uno de los estados permitidos.',
  ),
})

export const availabilityField = defineField({
  name: 'availability',
  title: 'Disponibilidad del original',
  type: 'availability',
})
