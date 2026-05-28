import { eq } from 'drizzle-orm'

import {
  type NewPartnershipSubmission,
  type PartnershipSubmission,
  partnershipSubmissions,
} from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link partnershipSubmissionOperation} constant
 * @description Human-readable operation labels for the partnership repository
 */
const partnershipSubmissionOperation = {
  CREATE: 'create partnership submission',
  MARK_SENT: 'mark partnership submission as sent',
  MARK_FAILED: 'mark partnership submission as failed',
} as const

/**
 * The {@link partnershipSubmissionStatus} constant
 * @description Stable status values written to `partnership_submissions.status`
 */
export const partnershipSubmissionStatus = {
  RECEIVED: 'received',
  SENT: 'sent',
  FAILED: 'failed',
} as const

/**
 * The {@link PartnershipSubmissionStatus} type
 * @description Union of values from {@link partnershipSubmissionStatus}
 */
export type PartnershipSubmissionStatus =
  (typeof partnershipSubmissionStatus)[keyof typeof partnershipSubmissionStatus]

/**
 * The {@link PartnershipSubmissionRepository} class
 * @description Repository for the public partnership inquiry submissions table
 */
export class PartnershipSubmissionRepository extends BaseRepository<typeof partnershipSubmissions> {
  /**
   * @description Binds the repository to the partnership_submissions table
   */
  constructor() {
    super(partnershipSubmissions)
  }

  /**
   * @description Persists a new submission with status `received`
   * @param {NewPartnershipSubmission} input - The fields to insert
   * @returns {Promise<PartnershipSubmission>} The inserted row
   */
  create(input: NewPartnershipSubmission): Promise<PartnershipSubmission> {
    return this.executeQuery(partnershipSubmissionOperation.CREATE, async () => {
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
    return this.executeQuery(partnershipSubmissionOperation.MARK_SENT, async () => {
      await this.db
        .update(this.table)
        .set({ status: partnershipSubmissionStatus.SENT, emailError: null })
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
    return this.executeQuery(partnershipSubmissionOperation.MARK_FAILED, async () => {
      await this.db
        .update(this.table)
        .set({ status: partnershipSubmissionStatus.FAILED, emailError: errorCode })
        .where(eq(this.table.id, id))
    })
  }
}
