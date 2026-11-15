import { NEPALI_DIGITS } from "@/constants"
import type { NumericInput } from "./types"

// Internal to the package (ADR-0012): imported by the domains, never re-exported from the barrel.

export interface Decimal {
  negative: boolean
  integer: string
  fraction: string
}

export type Grouping = "nepali" | "international"

const ASCII_ZERO = 48
const NEPALI_ZERO = NEPALI_DIGITS.charCodeAt(0)
const PLUS = 43
const MINUS = 45
const UNICODE_MINUS = 0x2212
const COMMA = 44
const SPACE = 32
const POINT = 46
const ASCII_FIVE = 53

/**
 * Digit value of one UTF-16 unit in either script.
 *
 * @param code - The character code
 *
 * @returns 0–9, or -1 when the unit is not a digit
 */
export const digitValue = (code: number): number => {
  if (code >= ASCII_ZERO && code <= ASCII_ZERO + 9) {
    return code - ASCII_ZERO
  }

  if (code >= NEPALI_ZERO && code <= NEPALI_ZERO + 9) {
    return code - NEPALI_ZERO
  }

  return -1
}

/**
 * Whether one UTF-16 unit is a Nepali digit.
 *
 * @param code - The character code
 *
 * @returns `true` for ०–९
 */
export const isNepaliDigitCode = (code: number): boolean => code >= NEPALI_ZERO && code <= NEPALI_ZERO + 9

const shiftDigits = (text: string, from: number, to: number): string => {
  let result = ""
  let start = 0

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)

    if (code >= from && code <= from + 9) {
      result += text.slice(start, index) + String.fromCharCode(code - from + to)
      start = index + 1
    }
  }

  return start === 0 ? text : result + text.slice(start)
}

/**
 * Replace every English digit with its Nepali digit in one pass.
 *
 * @param text - Any text
 *
 * @returns The text with `0-9` replaced
 */
export const toNepaliDigits = (text: string): string => shiftDigits(text, ASCII_ZERO, NEPALI_ZERO)

/**
 * Replace every Nepali digit with its English digit in one pass.
 *
 * @param text - Any text
 *
 * @returns The text with `०-९` replaced
 */
export const toEnglishDigits = (text: string): string => shiftDigits(text, NEPALI_ZERO, ASCII_ZERO)

/**
 * Write a finite number in full, never in exponent form.
 *
 * @param value - A JavaScript number
 *
 * @returns Its shortest round-trip decimal string; `"NaN"` and `"Infinity"` pass through
 */
export const numberToString = (value: number): string => {
  const text = String(value)
  const exponentAt = text.indexOf("e")

  if (exponentAt === -1) {
    return text
  }

  const negative = text.charCodeAt(0) === MINUS
  const mantissa = text.slice(negative ? 1 : 0, exponentAt)
  const exponent = Number(text.slice(exponentAt + 1))
  const pointIndex = mantissa.indexOf(".")
  const whole = pointIndex === -1 ? mantissa : mantissa.slice(0, pointIndex)
  const digits = pointIndex === -1 ? mantissa : whole + mantissa.slice(pointIndex + 1)
  const pointAt = whole.length + exponent
  const sign = negative ? "-" : ""

  if (pointAt <= 0) {
    return `${sign}0.${"0".repeat(-pointAt)}${digits}`
  }

  // JavaScript prints an exponent only from 1e21 up, where the point lies past its 17 significant digits.
  return sign + digits + "0".repeat(pointAt - digits.length)
}

/**
 * Drop leading zeros, keeping at least one digit.
 *
 * @param digits - ASCII digits
 *
 * @returns The digits without leading zeros
 */
export const stripLeadingZeros = (digits: string): string => {
  let start = 0

  while (start < digits.length - 1 && digits.charCodeAt(start) === ASCII_ZERO) {
    start++
  }

  return start === 0 ? digits : digits.slice(start)
}

/**
 * Whether a run of digits is empty or all zeros.
 *
 * @param digits - ASCII digits
 *
 * @returns `true` when no digit is non-zero
 */
export const isAllZeros = (digits: string): boolean => {
  for (let index = 0; index < digits.length; index++) {
    if (digits.charCodeAt(index) !== ASCII_ZERO) {
      return false
    }
  }

  return true
}

/**
 * Whether a parsed value is zero.
 *
 * @param value - A parsed decimal
 *
 * @returns `true` when every digit is zero
 */
export const isZeroDecimal = (value: Decimal): boolean => isAllZeros(value.integer) && isAllZeros(value.fraction)

/**
 * Read a whole string as a number, in one pass with no backtracking (ADR-0012).
 *
 * @param text - The trimmed text
 * @param nepaliOnly - Refuse English digits
 *
 * @returns The parsed decimal, or `null` when the text is not a number
 */
export const scanDecimal = (text: string, nepaliOnly: boolean = false): Decimal | null => {
  let index = 0
  let negative = false
  const first = text.charCodeAt(0)

  if (first === PLUS || first === MINUS || first === UNICODE_MINUS) {
    negative = first !== PLUS
    index = 1
  }

  let integer = ""
  let fraction = ""
  let seenPoint = false
  let seenDigit = false
  let pendingSeparator = false

  for (; index < text.length; index++) {
    const code = text.charCodeAt(index)
    const value = digitValue(code)

    if (value >= 0) {
      if (nepaliOnly && !isNepaliDigitCode(code)) {
        return null
      }

      seenDigit = true
      pendingSeparator = false

      if (seenPoint) {
        fraction += value
      } else {
        integer += value
      }

      continue
    }

    if (code === POINT && !seenPoint && !pendingSeparator) {
      seenPoint = true
      continue
    }

    if ((code === COMMA || code === SPACE) && !seenPoint && integer !== "") {
      pendingSeparator = true
      continue
    }

    return null
  }

  if (!seenDigit || pendingSeparator) {
    return null
  }

  const cleanInteger = stripLeadingZeros(integer === "" ? "0" : integer)

  return {
    negative: negative && !(isAllZeros(cleanInteger) && isAllZeros(fraction)),
    integer: cleanInteger,
    fraction,
  }
}

/**
 * Read a number once, exactly, into decimal digits (ADR-0012).
 *
 * @param input - A number, a bigint, or a string in English, Nepali or mixed digits
 *
 * @returns The parsed decimal, or `null` when the input is not a number
 */
export const parseDecimal = (input: NumericInput): Decimal | null => {
  if (typeof input === "string") {
    return scanDecimal(input.trim())
  }

  if (typeof input === "bigint") {
    return scanDecimal(input.toString())
  }

  if (typeof input === "number" && Number.isFinite(input)) {
    return scanDecimal(numberToString(input))
  }

  // null and undefined are outside the types but reachable from JavaScript — ADR-0012 D3.
  return null
}

const incrementDigits = (digits: string): string => {
  let index = digits.length - 1

  while (index >= 0 && digits.charCodeAt(index) === ASCII_ZERO + 9) {
    index--
  }

  const zeros = "0".repeat(digits.length - 1 - index)

  if (index < 0) {
    return `1${zeros}`
  }

  return digits.slice(0, index) + String.fromCharCode(digits.charCodeAt(index) + 1) + zeros
}

/**
 * Round to a fixed number of places, half away from zero on the digits as written (ADR-0012 D2).
 *
 * @param value - A parsed decimal
 * @param places - Decimal places to keep, a non-negative integer
 *
 * @returns A decimal whose fraction is exactly `places` digits; a zero result is never negative
 */
export const roundDecimal = (value: Decimal, places: number): Decimal => {
  const { integer, fraction } = value

  if (fraction.length <= places) {
    return { negative: value.negative, integer, fraction: fraction + "0".repeat(places - fraction.length) }
  }

  const kept = integer + fraction.slice(0, places)
  const digits = fraction.charCodeAt(places) >= ASCII_FIVE ? incrementDigits(kept) : kept
  const split = digits.length - places
  const roundedInteger = digits.slice(0, split)
  const roundedFraction = digits.slice(split)

  return {
    negative: value.negative && !(isAllZeros(roundedInteger) && isAllZeros(roundedFraction)),
    integer: roundedInteger,
    fraction: roundedFraction,
  }
}

/**
 * Read an option that counts decimal places.
 *
 * @param places - The caller's value
 * @param fallback - Used when the value is not an integer from 0 to 100
 *
 * @returns A safe number of places
 */
export const readPlaces = (places: number, fallback: number = 2): number => {
  return Number.isInteger(places) && places >= 0 && places <= 100 ? places : fallback
}

/**
 * Insert grouping commas into a run of digits of either script.
 *
 * @param integer - Digits only
 * @param grouping - Last three then pairs, or threes
 *
 * @returns The grouped digits
 */
export const groupDigits = (integer: string, grouping: Grouping = "nepali"): string => {
  if (integer.length <= 3) {
    return integer
  }

  const size = grouping === "international" ? 3 : 2
  const parts: string[] = [integer.slice(-3)]
  let end = integer.length - 3

  while (end > 0) {
    parts.push(integer.slice(Math.max(0, end - size), end))
    end -= size
  }

  return parts.reverse().join(",")
}

/**
 * Write a parsed decimal back as plain English digits.
 *
 * @param value - A parsed decimal
 *
 * @returns Sign, integer and, when present, the fraction
 */
export const decimalToString = (value: Decimal): string => {
  const sign = value.negative ? "-" : ""

  return value.fraction === "" ? sign + value.integer : `${sign}${value.integer}.${value.fraction}`
}

const compareMagnitude = (a: Decimal, b: Decimal): number => {
  if (a.integer.length !== b.integer.length) {
    return a.integer.length < b.integer.length ? -1 : 1
  }

  if (a.integer !== b.integer) {
    return a.integer < b.integer ? -1 : 1
  }

  const length = Math.max(a.fraction.length, b.fraction.length)
  const left = a.fraction + "0".repeat(length - a.fraction.length)
  const right = b.fraction + "0".repeat(length - b.fraction.length)

  if (left === right) {
    return 0
  }

  return left < right ? -1 : 1
}

/**
 * Compare two parsed decimals exactly.
 *
 * @param a - Left value
 * @param b - Right value
 *
 * @returns -1, 0 or 1
 */
export const compareDecimal = (a: Decimal, b: Decimal): number => {
  if (a.negative !== b.negative) {
    return a.negative ? -1 : 1
  }

  const magnitude = compareMagnitude(a, b)

  return a.negative ? -magnitude : magnitude
}

/**
 * Drop trailing zeros from a fraction.
 *
 * @param fraction - Fraction digits
 *
 * @returns The fraction without trailing zeros, possibly empty
 */
export const trimFraction = (fraction: string): string => {
  let end = fraction.length

  while (end > 0 && fraction.charCodeAt(end - 1) === ASCII_ZERO) {
    end--
  }

  return end === fraction.length ? fraction : fraction.slice(0, end)
}

/**
 * Multiply by a power of ten by moving the decimal point.
 *
 * @param value - A parsed decimal
 * @param power - Places to move; positive multiplies
 *
 * @returns The shifted decimal
 */
export const shiftDecimal = (value: Decimal, power: number): Decimal => {
  const digits = value.integer + value.fraction
  const pointAt = value.integer.length + power
  const padded = pointAt <= 0 ? "0".repeat(1 - pointAt) + digits : digits + "0".repeat(Math.max(0, pointAt - digits.length))
  const split = pointAt <= 0 ? 1 : pointAt

  return {
    negative: value.negative,
    integer: stripLeadingZeros(padded.slice(0, split)),
    fraction: padded.slice(split),
  }
}
