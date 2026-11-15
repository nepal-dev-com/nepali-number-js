import { NEPALI_FRACTIONS, NEPALI_MULTIPLIERS, NEPALI_NEGATIVE, NEPALI_TIMES } from "@/constants"
import type { NumericInput } from "@/conversion"
import { type Decimal, isAllZeros, isZeroDecimal, parseDecimal, roundDecimal, trimFraction } from "@/conversion/decimal"
import { toNepaliWords } from "@/words"

const QUARTER = "25"
const HALF = "5"
const THREE_QUARTERS = "75"

const spokenQuarter = (whole: string): string => {
  if (whole === "0") {
    return NEPALI_FRACTIONS.quarter
  }

  if (whole === "1") {
    return NEPALI_FRACTIONS.oneAndQuarter
  }

  return `${NEPALI_FRACTIONS.quarterPrefix} ${toNepaliWords(whole)}`
}

const spokenHalf = (whole: string): string => {
  if (whole === "0") {
    return NEPALI_FRACTIONS.half
  }

  if (whole === "1") {
    return NEPALI_FRACTIONS.oneAndHalf
  }

  if (whole === "2") {
    return NEPALI_FRACTIONS.twoAndHalf
  }

  return `${NEPALI_FRACTIONS.halfPrefix} ${toNepaliWords(whole)}`
}

const spokenThreeQuarters = (value: Decimal): string => {
  if (value.integer === "0") {
    return NEPALI_FRACTIONS.threeQuarters
  }

  // पौने names the next whole number; rounding n.75 to no places gives n + 1 exactly at any size.
  return `${NEPALI_FRACTIONS.threeQuarterPrefix} ${toNepaliWords(roundDecimal(value, 0).integer)}`
}

const spokenForm = (value: Decimal): string => {
  const fraction = trimFraction(value.fraction)

  if (fraction === QUARTER) {
    return spokenQuarter(value.integer)
  }

  if (fraction === HALF) {
    return spokenHalf(value.integer)
  }

  if (fraction === THREE_QUARTERS) {
    return spokenThreeQuarters(value)
  }

  return toNepaliWords(value.fraction === "" ? value.integer : `${value.integer}.${value.fraction}`)
}

/**
 * Write a value the way it is spoken when it is a whole number of quarters.
 *
 * @param value - A number, a bigint, or a string in English, Nepali or mixed digits
 *
 * @returns The spoken form for a quarter step, otherwise the Nepali words; `""` when the input is not a number
 *
 * @example
 * toNepaliFraction(1.5) // "डेढ"
 */
export const toNepaliFraction = (value: NumericInput): string => {
  const parsed = parseDecimal(value)

  if (parsed === null) {
    return ""
  }

  const words = spokenForm({ ...parsed, negative: false })

  return parsed.negative ? `${NEPALI_NEGATIVE} ${words}` : words
}

/**
 * Read a fraction aloud as numerator, बटा, denominator, without simplifying it.
 *
 * @param numerator - A whole number
 * @param denominator - A whole number greater than zero
 *
 * @returns The fraction in words; `""` for a non-integer, a denominator that is not positive, or input that is not a number
 *
 * @example
 * toNepaliFractionWords(2, 5) // "दुई बटा पाँच"
 */
export const toNepaliFractionWords = (numerator: NumericInput, denominator: NumericInput): string => {
  const top = parseDecimal(numerator)
  const bottom = parseDecimal(denominator)

  if (top === null || bottom === null || !isAllZeros(top.fraction) || !isAllZeros(bottom.fraction)) {
    return ""
  }

  if (bottom.negative || isZeroDecimal(bottom)) {
    return ""
  }

  const sign = top.negative ? `${NEPALI_NEGATIVE} ` : ""

  return `${sign}${toNepaliWords(top.integer)} ${NEPALI_FRACTIONS.connector} ${toNepaliWords(bottom.integer)}`
}

/**
 * Write a multiplier: its own word for 2, 3 and 4, otherwise the words followed by गुणा.
 *
 * @param times - A positive number, bigint, or string in English, Nepali or mixed digits
 *
 * @returns The multiplier in words; `""` for zero, a negative value or input that is not a number
 *
 * @example
 * toNepaliMultiplier(2) // "दोब्बर"
 */
export const toNepaliMultiplier = (times: NumericInput): string => {
  const parsed = parseDecimal(times)

  if (parsed === null || parsed.negative || isZeroDecimal(parsed)) {
    return ""
  }

  const fraction = trimFraction(parsed.fraction)

  if (fraction === "" && parsed.integer.length === 1) {
    const word = NEPALI_MULTIPLIERS[Number(parsed.integer)]

    if (word) {
      return word
    }
  }

  return `${toNepaliWords(fraction === "" ? parsed.integer : `${parsed.integer}.${fraction}`)} ${NEPALI_TIMES}`
}
