import { defineField, defineType } from 'sanity'
import { hasRequiredText, isEmptyValue, validationMessages } from '../validation'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configuración global',
  type: 'document',
  fields: [
    defineField({
      name: 'catalogSeoDescriptionEs',
      title: 'Descripción SEO del catálogo (ES)',
      type: 'text',
      description: 'Resumen aprobado por el artista para el catálogo en español; se usa solo en esa página.',
      validation: (Rule) => Rule.custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'catalogSeoDescriptionEn',
      title: 'Catalog SEO description (EN)',
      type: 'text',
      description: 'Artist-approved summary for the works page in English; it is used only on that page.',
      validation: (Rule) => Rule.custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.requiredText,
      ),
    }),
    defineField({
      name: 'homeIntroductionEs',
      title: 'Presentación breve del artista (ES)',
      type: 'text',
      description: 'Texto opcional aprobado por el artista para el hero de la home en español. No es una descripción SEO.',
      validation: (Rule) => Rule.custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.optionalText,
      ),
    }),
    defineField({
      name: 'homeIntroductionEn',
      title: 'Artist introduction (EN)',
      type: 'text',
      description: 'Optional artist-approved text for the homepage hero in English. This is not an SEO description.',
      validation: (Rule) => Rule.custom((value) =>
        isEmptyValue(value) || hasRequiredText(value) || validationMessages.optionalText,
      ),
    }),
  ],
})
