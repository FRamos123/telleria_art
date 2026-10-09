import { defineField } from 'sanity'
import { isValidAlternativeText } from '../../../web/src/domain/completeness'
import { hasImageAsset, isEmptyValue, validationMessages } from '../validation'

export function createEditorialImageField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    validation: (Rule) => {
      const assetRule = Rule.custom((value) => {
        if (value === undefined || value === null) return true
        return hasImageAsset(value) || validationMessages.imageAsset
      })
      return required ? assetRule.required() : assetRule.warning()
    },
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
        if (isEmptyValue(value)) return true

        const document = context.document as Record<string, unknown> | undefined
        return isValidAlternativeText(value, document?.[titleFieldName])
          || validationMessages.alternativeText
      })

      return required ? alternativeTextRule.required() : alternativeTextRule.warning()
    },
  })
}
