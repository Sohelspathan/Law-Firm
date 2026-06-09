import { defineField, defineType } from 'sanity'

export const caseResultSchema = defineType({
  name: 'caseResult',
  title: 'Case Result',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Case Title',
      type: 'string',
      description: 'A brief, anonymous description (e.g. "Commercial Lease Dispute")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome / Verdict',
      type: 'string',
      description: 'e.g. "$2.4M Settlement", "Not Guilty", "Injunction Granted"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Brief summary of the case and how the firm achieved this result.',
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'practiceArea',
      title: 'Practice Area',
      type: 'reference',
      to: [{ type: 'practiceArea' }],
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the case concluded (optional).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'outcome',
      featured: 'featured',
    },
    prepare({ title, subtitle, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
  ],
})
