import type { NumericInput } from "@/conversion"
import {
  decimalToString,
  digitValue,
  isNepaliDigitCode,
  parseDecimal,
  readPlaces,
  roundDecimal,
  scanDecimal,
  toNepaliDigits,
} from "@/conversion/decimal"
import type { NumberSystem, PadOptions } from "./types"

const MAX_PAD_LENGTH = 1000

/**
 * Left-pad a number with zeros; a minus sign stays in front and counts toward the length.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param length - Target length, at most 1000; a value that is not a finite integer adds no padding
 * @param options - `useNepaliDigits: false` keeps English digits
 *
 * @returns The padded string; `""` when the input is not a number
 *
 * @example
 * padZeros(42, 5) // "०००४२"
 */
export const padZeros = (number: NumericInput, length: number, options: PadOptions = {}): string => {
  const { useNepaliDigits = true } = options
  const parsed = parseDecimal(number)

  if (parsed === null) {
    return ""
  }

  const sign = parsed.negative ? "-" : ""
  const body = decimalToString({ ...parsed, negative: false })
  const width = Number.isInteger(length) ? Math.min(length, MAX_PAD_LENGTH) : 0
  const padded = sign + "0".repeat(Math.max(0, width - sign.length - body.length)) + body

  return useNepaliDigits ? toNepaliDigits(padded) : padded
}

/**
 * Round to a fixed number of decimals and return Nepali digits, without grouping.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param decimals - Decimal places; a value that is not an integer from 0 to 100 is read as 2
 *
 * @returns The rounded string; `""` when the input is not a number
 *
 * @example
 * roundNepali(3.14159) // "३.१४"
 */
export const roundNepali = (number: NumericInput, decimals: number = 2): string => {
  const parsed = parseDecimal(number)

  return parsed === null ? "" : toNepaliDigits(decimalToString(roundDecimal(parsed, readPlaces(decimals))))
}

/**
 * Check for exactly one Nepali digit.
 *
 * @param char - The text to check
 *
 * @returns `true` only for a single character in ०–९; `false` otherwise
 *
 * @example
 * isNepaliDigit("५") // true
 */
export const isNepaliDigit = (char: string): boolean => {
  return typeof char === "string" && char.length === 1 && isNepaliDigitCode(char.charCodeAt(0))
}

/**
 * Check for exactly one English digit.
 *
 * @param char - The text to check
 *
 * @returns `true` only for a single character in 0–9; `false` otherwise
 *
 * @example
 * isEnglishDigit("5") // true
 */
export const isEnglishDigit = (char: string): boolean => {
  if (typeof char !== "string" || char.length !== 1) {
    return false
  }

  const code = char.charCodeAt(0)

  return digitValue(code) >= 0 && !isNepaliDigitCode(code)
}

/**
 * Report which digit systems appear anywhere in the input.
 *
 * @param input - Any text
 *
 * @returns `"english"`, `"nepali"`, `"mixed"`, or `"none"` when there are no digits
 *
 * @example
 * detectNumberSystem("12३४") // "mixed"
 */
export const detectNumberSystem = (input: string): NumberSystem => {
  if (typeof input !== "string") {
    return "none"
  }

  let hasEnglish = false
  let hasNepali = false

  for (let index = 0; index < input.length; index++) {
    const code = input.charCodeAt(index)

    if (isNepaliDigitCode(code)) {
      hasNepali = true
    } else if (digitValue(code) >= 0) {
      hasEnglish = true
    }

    if (hasEnglish && hasNepali) {
      return "mixed"
    }
  }

  if (hasNepali) {
    return "nepali"
  }

  return hasEnglish ? "english" : "none"
}

/**
 * Check whether the input has both English and Nepali digits.
 *
 * @param input - Any text
 *
 * @returns `true` when both systems appear; `false` otherwise
 *
 * @example
 * isMixedNumber("12३४") // true
 */
export const isMixedNumber = (input: string): boolean => detectNumberSystem(input) === "mixed"

/**
 * Check whether the whole string is a number written in Nepali digits.
 *
 * @param input - The text to check
 *
 * @returns `true` for a number in Nepali digits; `false` otherwise
 *
 * @example
 * validateNepaliNumber("१२३.४५") // true
 */
export const validateNepaliNumber = (input: string): boolean => {
  return typeof input === "string" && scanDecimal(input.trim(), true) !== null
}

/**
 * Check whether the whole string is a number, in English, Nepali or mixed digits.
 *
 * @param input - The text to check
 *
 * @returns `true` when every number-reading function would accept it; `false` otherwise
 *
 * @example
 * isValidNumber("-1,234.5") // true
 */
export const isValidNumber = (input: string): boolean => {
  return typeof input === "string" && scanDecimal(input.trim()) !== null
}

/**
 * Clean up typed input: trim, remove all whitespace, collapse repeated commas and dots.
 *
 * @param input - Any text
 *
 * @returns The cleaned text; `""` for anything that is not a string
 *
 * @example
 * normalize("1,,234..5") // "1,234.5"
 */
export const normalize = (input: string): string => {
  if (typeof input !== "string") {
    return ""
  }

  return input
    .trim()
    .replace(/\s+/g, "")
    .replace(/,+/g, ",")
    .replace(/\.+/g, ".")
}
