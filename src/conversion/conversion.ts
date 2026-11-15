import { decimalToString, numberToString, parseDecimal, toEnglishDigits, toNepaliDigits } from "./decimal"
import type { NumericInput } from "./types"

const toText = (input: NumericInput): string => {
  if (typeof input === "string") {
    return input
  }

  if (typeof input === "number") {
    return numberToString(input)
  }

  if (typeof input === "bigint") {
    return input.toString()
  }

  // null and undefined are outside the types but reachable from JavaScript — ADR-0012 D3.
  return ""
}

/**
 * Convert English digits (0-9) to Nepali digits (०-९), keeping every other character.
 *
 * @param input - A number, a bigint or any text
 *
 * @returns The text with its English digits replaced; `""` for `null` or `undefined`
 *
 * @example
 * toNepali("Price 1,234.50") // "Price १,२३४.५०"
 */
export const toNepali = (input: NumericInput): string => toNepaliDigits(toText(input))

/**
 * Convert Nepali digits (०-९) to English digits (0-9), keeping every other character.
 *
 * @param input - A number, a bigint or any text
 *
 * @returns The text with its Nepali digits replaced; `""` for `null` or `undefined`
 *
 * @example
 * toEnglish("मूल्य १,२३४.५०") // "मूल्य 1,234.50"
 */
export const toEnglish = (input: NumericInput): string => toEnglishDigits(toText(input))

/**
 * Parse a number written in Nepali, English or mixed digits.
 *
 * @param input - A number, a bigint, or a string that is wholly a number
 *
 * @returns The JavaScript number; `NaN` when the input is not a number
 *
 * @example
 * parseNepaliNumber("१२,३४५.६७") // 12345.67
 */
export const parseNepaliNumber = (input: NumericInput): number => {
  const parsed = parseDecimal(input)

  return parsed === null ? NaN : Number(decimalToString(parsed))
}

/**
 * Convert the digits inside free text in either direction.
 *
 * @param text - Any text
 * @param toNepaliNumber - `true` for Nepali digits, `false` for English digits
 *
 * @returns The converted text; `""` for `null` or `undefined`
 *
 * @example
 * convert("Age 25") // "Age २५"
 */
export const convert = (text: string, toNepaliNumber: boolean = true): string => {
  return toNepaliNumber ? toNepali(text) : toEnglish(text)
}
