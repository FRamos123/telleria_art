import { defineField, defineType } from 'sanity'
import { createReferenceField } from '../fields'
import { hasRequiredText, isEditorialLanguage, isEmptyValue, validationMessages } from '../validation'

export const criticalTextTranslationType = defineType({
  name: 'criticalTextTranslation',
  title: 'Texto crítico (versión por idioma)',
  type: 'document',
  fields: [
    createReferenceField('criticalText', 'Texto crítico', ['criticalText'], true),
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      options: {
        list: [
          { title: 'Español (ES)', value: 'es' },
          { title: 'Inglés (EN)', value: 'en' },
        ],
      },
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isEditorialLanguage(value) || validationMessages.language,
      ),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'text',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'author',
      title: 'Autoría',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
  ],
  preview: {
  select: {
    title: 'criticalText.referenceName',
    language: 'language',
    media: 'criticalText.mainImage',
    inventoryNumber: 'criticalText.inventoryNumber',
  },
  prepare({ title, language, media, inventoryNumber }) {
    return {
      title: title || 'Traducción sin título',
      subtitle: [
        language?.toUpperCase(),
        inventoryNumber,
      ].filter(Boolean).join(' · '),
      media,
    }
  },
},
})
