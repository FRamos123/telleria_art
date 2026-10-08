import { defineField } from 'sanity'
import { isValidAlternativeText } from '../../../src/domain/completeness'

export function createEditorialImageField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    validation: (Rule) => required ? Rule.required() : Rule,
  })
}

export function createLocalizedImageAltField(
  name: string,
  title: string,
  titleFieldName: string,
  required = false,
) {
  return defineField({
    name,
    title,
    type: 'string',
    validation: (Rule) => {
      const alternativeTextRule = Rule.custom((value, context) => {
        if (!required && (value === undefined || value === null || value === '')) return true

        const document = context.document as Record<string, unknown> | undefined
        return isValidAlternativeText(value, document?.[titleFieldName])
          || 'El texto alternativo debe ser distinto del título y tener entre 1 y 150 caracteres.'
      })

      return required ? alternativeTextRule.required() : alternativeTextRule.warning()
    },
  })
}
