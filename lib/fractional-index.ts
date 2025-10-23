// Fractional indexing utilities for drag-and-drop reordering
// Based on the requirements for smooth reordering without database updates

const BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export function generateKeyBetween(a: string | null, b: string | null): string {
  if (a === null && b === null) {
    return "a0"
  }

  if (a === null) {
    return generateKeyBefore(b!)
  }

  if (b === null) {
    return generateKeyAfter(a)
  }

  // Generate a key between a and b
  const aChars = a.split("")
  const bChars = b.split("")

  let result = ""
  let i = 0

  while (i < Math.max(aChars.length, bChars.length)) {
    const aChar = aChars[i] || "0"
    const bChar = bChars[i] || "z"

    const aIndex = BASE_62_DIGITS.indexOf(aChar)
    const bIndex = BASE_62_DIGITS.indexOf(bChar)

    if (aIndex < bIndex - 1) {
      // There's room between them
      const midIndex = Math.floor((aIndex + bIndex) / 2)
      result += BASE_62_DIGITS[midIndex]
      break
    } else if (aIndex === bIndex) {
      result += aChar
      i++
    } else {
      // aIndex === bIndex - 1, need to go deeper
      result += aChar
      i++
    }
  }

  return result || "a0"
}

function generateKeyBefore(key: string): string {
  const firstChar = key[0]
  const index = BASE_62_DIGITS.indexOf(firstChar)

  if (index > 0) {
    return BASE_62_DIGITS[Math.floor(index / 2)]
  }

  return "0" + key
}

function generateKeyAfter(key: string): string {
  const lastChar = key[key.length - 1]
  const index = BASE_62_DIGITS.indexOf(lastChar)

  if (index < BASE_62_DIGITS.length - 1) {
    return key.slice(0, -1) + BASE_62_DIGITS[index + 1]
  }

  return key + "a"
}

export function sortByOrder<T extends { order: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order.localeCompare(b.order))
}
