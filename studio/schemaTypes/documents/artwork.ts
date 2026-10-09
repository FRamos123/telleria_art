import { defineField, defineType } from 'sanity'
import {
  availabilityField,
  createEditorialImageField,
  createReferenceField,
  createReferenceListField,
  dimensionsField,
} from '../fields'
import {
  hasRequiredText,
  isEmptyValue,
  isValidArtworkYear,
  isValidEditorialInventoryNumber,
  validationMessages,
} from '../validation'

export const artworkType = defineType({
  name: 'artwork',
  title: 'Obra',
  type: 'document',
  fields: [
    createReferenceField('series', 'Serie', ['series'], true),
    createReferenceListField('criticalTextIds', 'Textos críticos relacionados', ['criticalText']),
    createEditorialImageField('mainImage', 'Imagen principal', true),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (Rule) => Rule.required().custom((value) =>
        isEmptyValue(value) || isValidArtworkYear(value) || validationMessages.artworkYear,
      ),
    }),
    dimensionsField,
    defineField({
      name: 'inventoryNumber',
      title: 'Número de inventario',
      type: 'string',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
        if (isEmptyValue(value)) return true
        if (!hasRequiredText(value) || !isValidEditorialInventoryNumber(value)) {
          return validationMessages.inventoryNumber
        }

        const documentId = context.document?._id
        if (!documentId) return true

        const publishedId = documentId.replace(/^drafts\./, '')
        const draftId = `drafts.${publishedId}`
        const client = context.getClient({ apiVersion: '2025-02-19' })
          .withConfig({ perspective: 'drafts' })
        const duplicateExists = await client.fetch<boolean>(
          'count(*[_type == "artwork" && inventoryNumber == $inventoryNumber && !(_id in [$publishedId, $draftId])]) > 0',
          { inventoryNumber: value, publishedId, draftId },
        )

        return duplicateExists ? validationMessages.duplicateInventoryNumber : true
      }),
    }),
    availabilityField,
    defineField({
      name: 'workshopNote',
      title: 'Nota del cuaderno de taller',
      type: 'text',
    }),
  ],
})
