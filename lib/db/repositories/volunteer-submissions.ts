import { eq } from 'drizzle-orm'

import {
  type NewVolunteerSubmission,
  type VolunteerSubmission,
  volunteerSubmissions,
} from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link volunteerSubmissionOperation} constant
 * @description Human-readable operation labels for the volunteer repository
 */
const volunteerSubmissionOperation = {
  CREATE: 'create volunteer submission',
  MARK_SENT: 'mark volunteer submission as sent',
  MARK_FAILED: 'mark volunteer submission as failed',
} as const

/**
 * The {@link volunteerSubmissionStatus} constant
 * @description Stable status values written to `volunteer_submissions.status`
 */
export const volunteerSubmissionStatus = {
  RECEIVED: 'received',
  SENT: 'sent',
  FAILED: 'failed',
} as const

/**
 * The {@link VolunteerSubmissionStatus} type
 * @description Union of values from {@link volunteerSubmissionStatus}
 */
export type VolunteerSubmissionStatus =
  (typeof volunteerSubmissionStatus)[keyof typeof volunteerSubmissionStatus]

/**
 * The {@link VolunteerSubmissionRepository} class
 * @description Repository for the public volunteer application submissions table
 */
export class VolunteerSubmissionRepository extends BaseRepository<typeof volunteerSubmissions> {
  /**
   * @description Binds the repository to the volunteer_submissions table
   */
  constructor() {
    super(volunteerSubmissions)
  }

  /**
   * @description Persists a new submission with status `received`
   * @param {NewVolunteerSubmission} input - The fields to insert
   * @returns {Promise<VolunteerSubmission>} The inserted row
   */
  create(input: NewVolunteerSubmission): Promise<VolunteerSubmission> {
    return this.executeQuery(volunteerSubmissionOperation.CREATE, async () => {
      const [row] = await this.db.insert(this.table).values(input).returning()
      return row
    })
  }

  /**
   * @description Marks an existing submission as `sent`
   * @param {string} id - The submission id
   * @returns {Promise<void>}
   */
  markSent(id: string): Promise<void> {
    return this.executeQuery(volunteerSubmissionOperation.MARK_SENT, async () => {
      await this.db
        .update(this.table)
        .set({ status: volunteerSubmissionStatus.SENT, emailError: null })
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
    return this.executeQuery(volunteerSubmissionOperation.MARK_FAILED, async () => {
      await this.db
        .update(this.table)
        .set({ status: volunteerSubmissionStatus.FAILED, emailError: errorCode })
        .where(eq(this.table.id, id))
    })
  }
}
