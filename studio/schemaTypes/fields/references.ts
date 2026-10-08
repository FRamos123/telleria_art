import { defineField } from 'sanity'

export function createReferenceField(
  name: string,
  title: string,
  targetTypes: readonly string[],
  required = false,
) {
  const to = targetTypes.map((type) => ({ type }))

  return defineField({
    name,
    title,
    type: 'reference',
    to,
    validation: (Rule) => required ? Rule.required() : Rule,
  })
}

export function createReferenceListField(
  name: string,
  title: string,
  targetTypes: readonly string[],
) {
  const to = targetTypes.map((type) => ({ type }))

  return defineField({
    name,
    title,
    type: 'array',
    of: [{ type: 'reference', to }],
  })
}
