import { practiceAreaSchema } from './practiceArea'
import { attorneySchema } from './attorney'
import { caseResultSchema } from './caseResult'
import { postSchema } from './post'
import { contactSubmissionSchema } from './contactSubmission'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  // Content
  siteSettingsSchema,
  practiceAreaSchema,
  attorneySchema,
  caseResultSchema,
  postSchema,
  // CRM
  contactSubmissionSchema,
]
