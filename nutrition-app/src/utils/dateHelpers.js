// src/utils/dateHelpers.js

/**
 * Returns "morning", "afternoon", or "evening" based on current hour
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Format a date as "Wednesday, April 2"
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date as "Apr 2, 2026"
 */
export function formatDateShort(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a week range like "Mar 27 – Apr 2, 2026"
 */
export function formatWeekRange(startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = addDays(start, 6)

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return `${startStr} – ${endStr}`
}

/**
 * Add N days to a date
 */
export function addDays(date, n) {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/**
 * Get the Monday of the week containing the given date
 */
export function getWeekStart(date) {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  return d
}

/**
 * Format a date as YYYY-MM-DD
 */
export function toISODate(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Format time from ISO string as "7:30 AM"
 */
export function formatTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
