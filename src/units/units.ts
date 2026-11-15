import { LAND_UNIT_SQFT, UNIT_PARTS, WEIGHT_UNIT_GRAMS } from "@/constants"
import { decimalToString, parseDecimal, roundDecimal, scanDecimal, toNepaliDigits, trimFraction } from "@/conversion/decimal"
import type { LandUnit, UnitFormatOptions, WeightUnit } from "./types"

const LAST_PART_PLACES = 2
const SEPARATOR = "-"

const factorOf = (table: Record<string, number>, unit: string): number => {
  // An own-property check keeps names such as "toString" from reading the prototype.
  return typeof unit === "string" && Object.prototype.hasOwnProperty.call(table, unit) ? table[unit] ?? NaN : NaN
}

const convert = (table: Record<string, number>, value: number, from: string, to: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return NaN
  }

  return value * factorOf(table, from) / factorOf(table, to)
}

/**
 * Convert an area between traditional land units, square feet and square metres.
 *
 * @param value - The area in `from`
 * @param from - The unit `value` is in
 * @param to - The unit to convert to
 *
 * @returns The area in `to`, unrounded; `NaN` for an unknown unit or a non-finite value
 *
 * @example
 * convertLandArea(1, "ropani", "sqft") // 5476
 */
export const convertLandArea = (value: number, from: LandUnit, to: LandUnit): number => {
  return convert(LAND_UNIT_SQFT, value, from, to)
}

/**
 * Convert a weight between tola, lal, gram and kilogram.
 *
 * @param value - The weight in `from`
 * @param from - The unit `value` is in
 * @param to - The unit to convert to
 *
 * @returns The weight in `to`, unrounded; `NaN` for an unknown unit or a non-finite value
 *
 * @example
 * convertWeight(1, "tola", "lal") // 100
 */
export const convertWeight = (value: number, from: WeightUnit, to: WeightUnit): number => {
  return convert(WEIGHT_UNIT_GRAMS, value, from, to)
}

const formatParts = (
  value: number,
  options: UnitFormatOptions | undefined,
  system: string,
  table: Record<string, number>,
  defaultFrom: string,
): string => {
  const { from = defaultFrom, style = "notation", useNepaliDigits = true } = options ?? {}
  const parts = UNIT_PARTS[system] ?? []
  const last = parts[parts.length - 1]

  if (last === undefined || !(value >= 0)) {
    return ""
  }

  const total = parseDecimal(convert(table, value, from, last.unit))

  if (total === null) {
    return ""
  }

  // Splitting whole hundredths of the last part makes the rounding carry upward by itself.
  const rounded = roundDecimal(total, LAST_PART_PLACES)
  const scale = BigInt(10 ** LAST_PART_PLACES)
  let rest = BigInt(rounded.integer + rounded.fraction)

  const lastSize = BigInt(last.base) * scale
  const lastHundredths = rest % lastSize
  rest /= lastSize

  const lastFraction = trimFraction((lastHundredths % scale).toString().padStart(LAST_PART_PLACES, "0"))
  const lastWhole = (lastHundredths / scale).toString()
  const amounts: string[] = [lastFraction === "" ? lastWhole : `${lastWhole}.${lastFraction}`]

  for (let index = parts.length - 2; index >= 1; index--) {
    const base = BigInt(parts[index]?.base ?? 1)

    amounts.unshift((rest % base).toString())
    rest /= base
  }

  amounts.unshift(rest.toString())

  let formatted: string
  if (style === "words") {
    const named = amounts
      .map((amount, index) => amount === "0" ? "" : `${amount} ${parts[index]?.label ?? ""}`)
      .filter((part) => part !== "")

    formatted = named.length === 0 ? `0 ${parts[0]?.label ?? ""}` : named.join(" ")
  } else {
    formatted = amounts.join(SEPARATOR)
  }

  return useNepaliDigits ? toNepaliDigits(formatted) : formatted
}

/**
 * Write an area in the hill system: ropani, aana, paisa, dam.
 *
 * @param value - The area, in square feet unless `from` says otherwise
 * @param options - The unit of `value`, notation or words, and the digits
 *
 * @returns The four parts, dam rounded to two places; `""` for a negative or non-finite value or a `from` that is not a land unit
 *
 * @example
 * formatRopani(6438.578125) // "१-२-३-१"
 */
export const formatRopani = (value: number, options?: UnitFormatOptions): string => {
  return formatParts(value, options, "ropani", LAND_UNIT_SQFT, "sqft")
}

/**
 * Write an area in the Terai system: bigha, kattha, dhur.
 *
 * @param value - The area, in square feet unless `from` says otherwise
 * @param options - The unit of `value`, notation or words, and the digits
 *
 * @returns The three parts, dhur rounded to two places; `""` for a negative or non-finite value or a `from` that is not a land unit
 *
 * @example
 * formatBigha(1.5, { from: "bigha" }) // "१-१०-०"
 */
export const formatBigha = (value: number, options?: UnitFormatOptions): string => {
  return formatParts(value, options, "bigha", LAND_UNIT_SQFT, "sqft")
}

/**
 * Write a weight as tola and lal.
 *
 * @param value - The weight, in grams unless `from` says otherwise
 * @param options - The unit of `value`, notation or words, and the digits
 *
 * @returns Tola and lal, lal rounded to two places; `""` for a negative or non-finite value or a `from` that is not a weight unit
 *
 * @example
 * formatTola(29.1595) // "२-५०"
 */
export const formatTola = (value: number, options?: UnitFormatOptions): string => {
  return formatParts(value, options, "tola", WEIGHT_UNIT_GRAMS, "gram")
}

/**
 * Read a land record written in notation, such as `१-२-३-१`.
 *
 * @param text - Hyphen-separated parts: four for `"ropani"`, three for `"bigha"`
 * @param system - The system the record is written in
 *
 * @returns The area in square feet; `NaN` for a wrong part count, a sign, or anything that is not a number
 *
 * @example
 * parseLandArea("१-२-३-१", "ropani") // 6438.578125
 */
export const parseLandArea = (text: string, system: "ropani" | "bigha"): number => {
  if (typeof text !== "string" || (system !== "ropani" && system !== "bigha")) {
    return NaN
  }

  const parts = UNIT_PARTS[system] ?? []
  const written = text.trim().split(SEPARATOR)

  if (written.length !== parts.length) {
    return NaN
  }

  let total = 0

  for (let index = 0; index < written.length; index++) {
    const part = (written[index] ?? "").trim()
    const parsed = scanDecimal(part)

    // A "+" would pass the reader; a record has no signs.
    if (parsed === null || part.charCodeAt(0) === 43) {
      return NaN
    }

    total += Number(decimalToString(parsed)) * factorOf(LAND_UNIT_SQFT, parts[index]?.unit ?? "")
  }

  return total
}
