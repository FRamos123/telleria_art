import { defineField, defineType } from 'sanity'
import { AVAILABILITY_VALUES, isAvailability } from '../../../src/domain/availability'

export const availabilityType = defineType({
  name: 'availability',
  title: 'Disponibilidad del original',
  type: 'string',
  options: {
    list: AVAILABILITY_VALUES.map((value) => ({ title: value, value })),
  },
  validation: (Rule) => Rule.custom((value) =>
    isAvailability(value) || 'Selecciona uno de los estados permitidos.',
  ),
})

export const availabilityField = defineField({
  name: 'availability',
  title: 'Disponibilidad del original',
  type: 'availability',
})
