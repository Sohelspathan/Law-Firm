'use client'

import { useActionState } from 'react'
import { submitContactForm } from '@/actions/contact'
import type { FormState } from '@/types'
import type { PracticeAreaSummary } from '@/types'

const INITIAL_STATE: FormState = { status: 'idle' }

const TIME_OPTIONS = [
  'Morning (9am – 12pm)',
  'Afternoon (12pm – 3pm)',
  'Late Afternoon (3pm – 6pm)',
  'I\'m flexible',
]

interface ContactFormProps {
  practiceAreas: PracticeAreaSummary[]
}

export function ContactForm({ practiceAreas }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, INITIAL_STATE)

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-8 card-dark">
        <div className="w-16 h-16 rounded-full border-2 border-gold-500 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-medium text-cream-200 mb-4">
          Message Received
        </h3>
        <p className="text-warm-400 max-w-sm leading-relaxed">{state.message}</p>
        <div className="gold-line mx-auto" />
        <p className="text-warm-500 text-sm">
          Our office hours are Monday–Friday, 9am–6pm.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === 'error' && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-sm px-4 py-3 text-red-300 text-sm">
          {state.message}
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="text-gold-rule block mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                       placeholder:text-warm-600 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-gold-rule block mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                       placeholder:text-warm-600 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      {/* Phone + Practice Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="text-gold-rule block mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                       placeholder:text-warm-600 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="(555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="practiceArea" className="text-gold-rule block mb-2">
            Area of Need
          </label>
          <select
            id="practiceArea"
            name="practiceArea"
            className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                       focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Select a Practice Area</option>
            {practiceAreas.map((area) => (
              <option key={area._id} value={area.title}>
                {area.title}
              </option>
            ))}
            <option value="other">Other / Not Sure</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="text-gold-rule block mb-2">
          Describe Your Matter <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                     placeholder:text-warm-600 focus:outline-none focus:border-gold-500 transition-colors resize-none"
          placeholder="Briefly describe your situation. All communications are confidential."
        />
      </div>

      {/* Preferred Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-gold-rule mb-3">Preferred Contact Method</p>
          <div className="flex gap-6">
            {(['email', 'phone'] as const).map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  defaultChecked={method === 'email'}
                  className="accent-gold-500"
                />
                <span className="text-warm-400 text-sm capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="preferredTime" className="text-gold-rule block mb-2">
            Preferred Time to Call
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            className="w-full bg-navy-700 border border-navy-500 text-cream-200 px-4 py-3 text-sm
                       focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">No preference</option>
            {TIME_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-warm-600 text-xs leading-relaxed">
        By submitting this form, you acknowledge that contacting this firm does not create an attorney-client
        relationship. Please do not send confidential information until an engagement letter has been signed.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </>
        ) : (
          'Request Consultation'
        )}
      </button>
    </form>
  )
}
