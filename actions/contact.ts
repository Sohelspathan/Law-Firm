'use server'

import { writeClient } from '@/sanity/lib/client'
import type { ContactSubmission, FormState } from '@/types'

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const practiceArea = (formData.get('practiceArea') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()
  const preferredContact = formData.get('preferredContact') as 'email' | 'phone'
  const preferredTime = (formData.get('preferredTime') as string)?.trim()

  // ── Server-side validation ───────────────────────────────────────────────────
  if (!name || name.length < 2) {
    return { status: 'error', message: 'Please enter your full name.' }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  if (!message || message.length < 10) {
    return { status: 'error', message: 'Please describe your matter (at least 10 characters).' }
  }

  try {
    const submission: ContactSubmission = {
      _type: 'contactSubmission',
      name,
      email,
      phone: phone || undefined,
      practiceArea: practiceArea || undefined,
      message,
      preferredContact: preferredContact ?? 'email',
      preferredTime: preferredTime || undefined,
      submittedAt: new Date().toISOString(),
    }

    await writeClient.create(submission)

    return {
      status: 'success',
      message:
        'Thank you — your message has been received. A member of our team will be in touch within one business day.',
    }
  } catch (err) {
    console.error('[Contact Form] Sanity write error:', err)
    return {
      status: 'error',
      message: 'Something went wrong on our end. Please try again or call us directly.',
    }
  }
}
