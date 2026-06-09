'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

// visionTool (GROQ playground) only loads in local dev — never shown to clients
const isDev = process.env.NODE_ENV === 'production'

export default defineConfig({
  name: 'law-firm-studio',
  title: 'Content Manager',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({
      // ─── Sidebar structure ──────────────────────────────────────────────
      // Ordered so the most-used items appear at the top.
      // Non-technical clients land here and see plain English labels.
      structure: (S) =>
        S.list()
          .title('Content Manager')
          .items([

            // ── Daily use ─────────────────────────────────────────────────
            S.listItem()
              .title('📬 Contact Submissions')
              .schemaType('contactSubmission')
              .child(
                S.documentTypeList('contactSubmission')
                  .title('Contact Submissions')
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),

            S.listItem()
              .title('📝 Insights / Blog')
              .schemaType('post')
              .child(
                S.documentTypeList('post')
                  .title('Blog Articles')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.divider(),

            // ── Occasional edits ──────────────────────────────────────────
            S.listItem()
              .title('⚖️ Practice Areas')
              .schemaType('practiceArea')
              .child(
                S.documentTypeList('practiceArea')
                  .title('Practice Areas')
                  .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
              ),

            S.listItem()
              .title('👤 Attorneys')
              .schemaType('attorney')
              .child(
                S.documentTypeList('attorney')
                  .title('Attorney Profiles')
                  .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
              ),

            S.listItem()
              .title('🏆 Case Results')
              .schemaType('caseResult')
              .child(
                S.documentTypeList('caseResult')
                  .title('Case Results')
                  .defaultOrdering([
                    { field: 'featured', direction: 'desc' },
                    { field: '_createdAt', direction: 'desc' },
                  ])
              ),

            S.divider(),

            // ── Site-wide settings (singleton — only one document ever) ───
            S.listItem()
              .title('⚙️ Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
          ]),
    }),

    // visionTool is the GROQ query playground — developers only, never in prod
    ...(isDev ? [require('@sanity/vision').visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },
})
