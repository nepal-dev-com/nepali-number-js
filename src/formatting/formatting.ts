import type { NumericInput } from "@/conversion"
import { digitValue, type Grouping, groupDigits, parseDecimal, shiftDecimal, toEnglishDigits } from "@/conversion/decimal"
import { formatDecimal } from "./internal"
import type { FormatOptions, PercentOptions } from "./types"

const MINUS = 45
const POINT = 46

/**
 * Format a number for display: round, group with commas and convert to Nepali digits.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - Digits, grouping, precision and sign
 *
 * @returns The formatted string, exact at any size; `""` when the input is not a number
 *
 * @example
 * formatNepaliNumber(1234567) // "१२,३४,५६७"
 */
export const formatNepaliNumber = (number: NumericInput, options: FormatOptions = {}): string => {
  const parsed = parseDecimal(number)

  return parsed === null ? "" : formatDecimal(parsed, options)
}

const isZeroDigit = (code: number): boolean => digitValue(code) === 0

const groupWritten = (text: string, negative: boolean, grouping: Grouping): string => {
  let integer = ""
  let fraction = ""
  let seenPoint = false

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)

    if (code === POINT) {
      seenPoint = true
    } else if (digitValue(code) >= 0) {
      if (seenPoint) {
        fraction += text[index]
      } else {
        integer += text[index]
      }
    }
  }

  let start = 0
  while (start < integer.length - 1 && isZeroDigit(integer.charCodeAt(start))) {
    start++
  }

  const grouped = groupDigits(integer === "" ? "0" : integer.slice(start), grouping)
  const sign = negative ? "-" : ""

  return fraction === "" ? sign + grouped : `${sign}${grouped}.${fraction}`
}

/**
 * Insert grouping commas without rounding, keeping each digit in the script it was written in.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param grouping - `"nepali"` (last three, then pairs) or `"international"` (threes)
 *
 * @returns The grouped string; `""` when the input is not a number
 *
 * @example
 * addNepaliCommas(1234567) // "12,34,567"
 */
export const addNepaliCommas = (number: NumericInput, grouping: Grouping = "nepali"): string => {
  const parsed = parseDecimal(number)

  if (parsed === null) {
    return ""
  }

  if (typeof number === "string") {
    // The parsed digits are ASCII; the written ones keep their script.
    return groupWritten(number, parsed.negative, grouping)
  }

  const integer = groupDigits(parsed.integer, grouping)
  const sign = parsed.negative ? "-" : ""

  return parsed.fraction === "" ? sign + integer : `${sign}${integer}.${parsed.fraction}`
}

/**
 * Format a percentage.
 *
 * @param value - The percentage, or a ratio when `isRatio` is set
 * @param options - Digits, precision, grouping, ratio and symbol
 *
 * @returns The formatted number followed by the symbol; `""` when the input is not a number
 *
 * @example
 * formatPercent(12.5) // "१२.५०%"
 */
export const formatPercent = (value: NumericInput, options: PercentOptions = {}): string => {
  const { isRatio = false, symbol = "%", ...format } = options
  const parsed = parseDecimal(value)

  if (parsed === null) {
    return ""
  }

  return formatDecimal(isRatio ? shiftDecimal(parsed, 2) : parsed, format) + symbol
}

/**
 * Pull the number out of formatted text, dropping everything but digits, the sign and the dot.
 *
 * @param formattedString - Any formatted amount
 *
 * @returns The number; `NaN` when the text holds no number
 *
 * @example
 * removeFormatting("रू १२,३४,५६७.८९") // 1234567.89
 */
export const removeFormatting = (formattedString: string | number): number => {
  if (typeof formattedString === "number") {
    return formattedString
  }

  if (typeof formattedString !== "string") {
    return NaN
  }

  const text = toEnglishDigits(formattedString)
  let kept = ""
  let hasDigit = false

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)

    if (digitValue(code) >= 0) {
      hasDigit = true
      kept += text[index]
    } else if (code === MINUS || code === POINT) {
      kept += text[index]
    }
  }

  return hasDigit ? Number(kept) : NaN
}
