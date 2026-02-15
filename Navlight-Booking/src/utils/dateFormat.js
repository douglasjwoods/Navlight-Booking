import { format, parseISO, isValid } from 'date-fns'

export function formatDisplayDate(value) {
  if (!value) return ''

  try {
    const parsed = parseISO(value)
    if (isValid(parsed)) {
      return format(parsed, 'dd/MM/yyyy')
    }
  } catch {
    // Fall through to raw value
  }

  return value
}
