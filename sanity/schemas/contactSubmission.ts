import { defineField, defineType } from 'sanity'

export const contactSubmissionSchema = defineType({
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  // Read-only in Studio — data written by server action
  // __experimental_actions: ['update', 'delete'],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({
      name: 'practiceArea',
      title: 'Practice Area',
      type: 'string',
      readOnly: true,
    }),
    defineField({ name: 'message', title: 'Message', type: 'text', readOnly: true }),
    defineField({
      name: 'preferredContact',
      title: 'Preferred Contact Method',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'preferredTime',
      title: 'Preferred Time to Call',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🔴 New', value: 'new' },
          { title: '🟡 In Progress', value: 'in_progress' },
          { title: '🟢 Resolved', value: 'resolved' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Staff notes visible only in Studio.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, status, date }) {
      const statusEmoji = status === 'new' ? '🔴' : status === 'in_progress' ? '🟡' : '🟢'
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${subtitle} · ${date ? new Date(date).toLocaleString() : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
})
