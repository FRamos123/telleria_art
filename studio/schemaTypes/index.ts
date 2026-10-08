import { availabilityType, dimensionsType } from './fields'
import { artworkType } from './documents/artwork'
import { artworkTranslationType } from './documents/artworkTranslation'
import { criticalTextType } from './documents/criticalText'
import { criticalTextTranslationType } from './documents/criticalTextTranslation'
import { exhibitionType } from './documents/exhibition'
import { exhibitionTranslationType } from './documents/exhibitionTranslation'
import { seriesType } from './documents/series'
import { seriesTranslationType } from './documents/seriesTranslation'

export const schemaTypes = [
  dimensionsType,
  availabilityType,
  artworkType,
  artworkTranslationType,
  seriesType,
  seriesTranslationType,
  exhibitionType,
  exhibitionTranslationType,
  criticalTextType,
  criticalTextTranslationType,
]

export {
  availabilityField,
  createEditorialImageField,
  createLocalizedImageAltField,
  createReferenceField,
  createReferenceListField,
  dimensionsField,
} from './fields'
