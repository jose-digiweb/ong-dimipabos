import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The {@link cn} function
 * @description Merges Tailwind CSS class names with conflict resolution
 * @param {ClassValue[]} inputs - The class values to merge
 * @returns {string} The merged class string with conflicting Tailwind classes resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
