import { eq } from 'drizzle-orm'

import { type ContactSubmission, type NewContactSubmission, contactSubmissions } from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link contactSubmissionOperation} constant
 * @description Human-readable operation labels for the contact submission repository
 */
const contactSubmissionOperation = {
  CREATE: 'create contact submission',
  MARK_SENT: 'mark contact submission as sent',
  MARK_FAILED: 'mark contact submission as failed',
} as const

/**
 * The {@link contactSubmissionStatus} constant
 * @description Stable status values written to `contact_submissions.status`
 */
export const contactSubmissionStatus = {
  RECEIVED: 'received',
  SENT: 'sent',
  FAILED: 'failed',
} as const

/**
 * The {@link ContactSubmissionStatus} type
 * @description Union of values from {@link contactSubmissionStatus}
 */
export type ContactSubmissionStatus =
  (typeof contactSubmissionStatus)[keyof typeof contactSubmissionStatus]

/**
 * The {@link ContactSubmissionRepository} class
 * @description Repository for the public contact form submissions table
 */
export class ContactSubmissionRepository extends BaseRepository<typeof contactSubmissions> {
  /**
   * @description Binds the repository to the contact_submissions table
   */
  constructor() {
    super(contactSubmissions)
  }

  /**
   * @description Persists a new submission with status `received`
   * @param {NewContactSubmission} input - The fields to insert
   * @returns {Promise<ContactSubmission>} The inserted row
   */
  create(input: NewContactSubmission): Promise<ContactSubmission> {
    return this.executeQuery(contactSubmissionOperation.CREATE, async () => {
      // Insert and return the new row
      const [row] = await this.db.insert(this.table).values(input).returning()

      // Return the inserted submission
      return row
    })
  }

  /**
   * @description Marks an existing submission as `sent`
   * @param {string} id - The submission id
   * @returns {Promise<void>}
   */
  markSent(id: string): Promise<void> {
    return this.executeQuery(contactSubmissionOperation.MARK_SENT, async () => {
      await this.db
        .update(this.table)
        .set({ status: contactSubmissionStatus.SENT, emailError: null })
        .where(eq(this.table.id, id))
    })
  }

  /**
   * @description Marks an existing submission as `failed` with an error code
   * @param {string} id - The submission id
   * @param {string} errorCode - Stable error label (e.g. Email API error code)
   * @returns {Promise<void>}
   */
  markFailed(id: string, errorCode: string): Promise<void> {
    return this.executeQuery(contactSubmissionOperation.MARK_FAILED, async () => {
      await this.db
        .update(this.table)
        .set({ status: contactSubmissionStatus.FAILED, emailError: errorCode })
        .where(eq(this.table.id, id))
    })
  }
}
