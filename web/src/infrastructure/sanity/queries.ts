const IMAGE_PROJECTION = `{
	"asset": asset->{_id, url, metadata{dimensions{width, height}}},
	crop,
	hotspot
}`

export const artworkQuery = `*[_type == "artwork"] {
	_id,
	"seriesId": series._ref,
	"criticalTextIds": coalesce(criticalTextIds[]._ref, []),
	"mainImage": mainImage${IMAGE_PROJECTION},
	year,
	dimensions{heightCm, widthCm},
	inventoryNumber,
	availability,
	workshopNote,
	"translations": *[_type == "artworkTranslation" && references(^._id)] {
		_id,
		language,
		title,
		technique,
		support,
		altText,
		workshopNote
	}
}`

export const seriesQuery = `*[_type == "series"] {
	_id,
	"image": image${IMAGE_PROJECTION},
	"translations": *[_type == "seriesTranslation" && references(^._id)] {
		_id,
		language,
		name,
		description,
		imageAlt
	}
}`

export const exhibitionQuery = `*[_type == "exhibition"] {
	_id,
	startDate,
	endDate,
	"image": image${IMAGE_PROJECTION},
	"artworkIds": coalesce(artworkIds[]._ref, []),
	"seriesIds": coalesce(seriesIds[]._ref, []),
	"translations": *[_type == "exhibitionTranslation" && references(^._id)] {
		_id,
		language,
		title,
		venue,
		imageAlt
	}
}`

export const criticalTextQuery = `*[_type == "criticalText"] {
	_id,
	originalLanguage,
	"artworkIds": coalesce(artworkIds[]._ref, []),
	"seriesIds": coalesce(seriesIds[]._ref, []),
	"translations": *[_type == "criticalTextTranslation" && references(^._id)] {
		_id,
		language,
		title,
		body,
		author
	}
}`
