import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const LOCALE = "en-GB" as const

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleDateString(LOCALE, options)
}
