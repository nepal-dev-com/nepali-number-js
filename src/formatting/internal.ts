import { type Decimal, groupDigits, isZeroDecimal, readPlaces, roundDecimal, toNepaliDigits, trimFraction } from "@/conversion/decimal"
import type { FormatOptions } from "./types"

// Internal to the package: shared by formatting, words and currency, never re-exported from the barrel.

/**
 * Round, group and convert a parsed decimal for display.
 *
 * @param value - A parsed decimal
 * @param options - The formatting options
 *
 * @returns The formatted string
 */
export const formatDecimal = (value: Decimal, options: FormatOptions = {}): string => {
  const {
    useNepaliDigits = true,
    addCommas = true,
    grouping = "nepali",
    precision = 2,
    trimZero = true,
    sign = "auto",
  } = options

  const rounded = roundDecimal(value, readPlaces(precision))
  const fraction = trimZero && trimFraction(rounded.fraction) === "" ? "" : rounded.fraction
  const integer = addCommas ? groupDigits(rounded.integer, grouping) : rounded.integer

  let prefix = ""
  if (rounded.negative) {
    prefix = "-"
  } else if (sign === "always" && !isZeroDecimal(rounded)) {
    prefix = "+"
  }

  const formatted = fraction === "" ? prefix + integer : `${prefix}${integer}.${fraction}`

  return useNepaliDigits ? toNepaliDigits(formatted) : formatted
}
