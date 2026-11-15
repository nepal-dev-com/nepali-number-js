import {
  ENGLISH_AND,
  ENGLISH_INTERNATIONAL_SCALES,
  ENGLISH_NEGATIVE,
  ENGLISH_ORDINAL_EXCEPTIONS,
  ENGLISH_ORDINAL_SUFFIXES,
  ENGLISH_POINT,
  ENGLISH_WORDS,
  NEPALI_DECIMAL_POINT,
  NEPALI_NEGATIVE,
  NEPALI_ORDINAL_SUFFIXES,
  NEPALI_ORDINALS,
  NEPALI_ORDINALS_EXCEPTIONS,
  NEPALI_SCALES,
  NEPALI_WORDS,
} from "@/constants"
import type { NumericInput } from "@/conversion"
import {
  type Decimal,
  decimalToString,
  isAllZeros,
  parseDecimal,
  readPlaces,
  roundDecimal,
  shiftDecimal,
  stripLeadingZeros,
  toNepaliDigits,
  trimFraction,
} from "@/conversion/decimal"
import { formatDecimal } from "@/formatting/internal"
import type { DecimalWordOptions, EnglishWordsOptions, OrdinalNumberOptions } from "./types"

interface Scale {
  zeros: number
  label: string
}

const NEPALI_WORD_SCALES: Scale[] = NEPALI_SCALES.map((scale) => ({ zeros: scale.zeros, label: scale.label_np }))
const ENGLISH_NEPALI_SCALES: Scale[] = NEPALI_SCALES.map((scale) => ({ zeros: scale.zeros, label: scale.label_en }))
const ENGLISH_WORLD_SCALES: Scale[] = ENGLISH_INTERNATIONAL_SCALES.map((scale) => ({ zeros: scale.zeros, label: scale.label_en }))

// The hundred is the last entry of every scale list; only it takes "and" in English.
const HUNDRED_ZEROS = 2

// Every list ends with the hundred, which any number of three digits or more reaches.
const largestScale = <T extends { zeros: number }>(scales: T[], digits: string): T => {
  return scales.find((scale) => digits.length > scale.zeros) as T
}

const spellBelowTop = (digits: string, scales: Scale[], small: (value: number) => string, joiner: string): string => {
  if (digits.length <= HUNDRED_ZEROS) {
    return small(Number(digits))
  }

  const scale = largestScale(scales, digits)
  const count = digits.slice(0, digits.length - scale.zeros)
  const rest = stripLeadingZeros(digits.slice(digits.length - scale.zeros))
  const head = `${spellBelowTop(count, scales, small, joiner)} ${scale.label}`

  if (rest === "0") {
    return head
  }

  const link = joiner !== "" && scale.zeros === HUNDRED_ZEROS ? ` ${joiner} ` : " "

  return head + link + spellBelowTop(rest, scales, small, joiner)
}

const spellInteger = (digits: string, scales: Scale[], small: (value: number) => string, joiner: string = ""): string => {
  const top = scales[0]?.zeros ?? 0
  const label = scales[0]?.label ?? ""

  if (top === 0 || digits.length <= top) {
    return spellBelowTop(digits, scales, small, joiner)
  }

  // Above the largest scale the count is written out again and again. A loop, not recursion:
  // a 100 000-digit string would otherwise overflow the stack and throw (invariant 4).
  const lead = digits.length % top || top
  let words = spellBelowTop(digits.slice(0, lead), scales, small, joiner)

  for (let at = lead; at < digits.length; at += top) {
    const chunk = stripLeadingZeros(digits.slice(at, at + top))

    words += ` ${label}`
    if (chunk !== "0") {
      words += ` ${spellBelowTop(chunk, scales, small, joiner)}`
    }
  }

  return words
}

const spellFraction = (fraction: string, point: string, digitWord: (value: number) => string): string => {
  const digits = trimFraction(fraction)

  if (digits === "") {
    return ""
  }

  let words = ` ${point}`
  for (let index = 0; index < digits.length; index++) {
    words += ` ${digitWord(Number(digits[index]))}`
  }

  return words
}

const nepaliSmall = (value: number): string => NEPALI_WORDS[value] || ""

const nepaliInteger = (digits: string): string => spellInteger(digits, NEPALI_WORD_SCALES, nepaliSmall)

/**
 * Write a number in Nepali words.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 *
 * @returns The words, exact at any size, with a fraction read digit by digit; `""` when the input is not a number
 *
 * @example
 * toNepaliWords(123) // "एक सय तेईस"
 */
export const toNepaliWords = (number: NumericInput): string => {
  const parsed = parseDecimal(number)

  if (parsed === null) {
    return ""
  }

  const words = nepaliInteger(parsed.integer) + spellFraction(parsed.fraction, NEPALI_DECIMAL_POINT, nepaliSmall)

  return parsed.negative ? `${NEPALI_NEGATIVE} ${words}` : words
}

const englishSmall = (hyphenate: boolean) => (value: number): string => {
  if (value < 10) {
    return ENGLISH_WORDS.ONES[value] || ""
  }

  if (value < 20) {
    return ENGLISH_WORDS.TEENS[value - 10] || ""
  }

  const tens = ENGLISH_WORDS.TENS[Math.floor(value / 10) - 2] || ""
  const ones = value % 10

  if (ones === 0) {
    return tens
  }

  return tens + (hyphenate ? "-" : " ") + (ENGLISH_WORDS.ONES[ones] || "")
}

const englishWords = (parsed: Decimal, options: EnglishWordsOptions): string => {
  const { system = "nepali", hyphenate = false, and = false } = options
  const scales = system === "international" ? ENGLISH_WORLD_SCALES : ENGLISH_NEPALI_SCALES
  const small = englishSmall(hyphenate)
  const words = spellInteger(parsed.integer, scales, small, and ? ENGLISH_AND : "")
    + spellFraction(parsed.fraction, ENGLISH_POINT, small)

  return parsed.negative ? `${ENGLISH_NEGATIVE} ${words}` : words
}

/**
 * Write a number in lower-case English words.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - Scale system, hyphens and "and"
 *
 * @returns The words, exact at any size; `""` when the input is not a number
 *
 * @example
 * toEnglishWords(123) // "one hundred twenty three"
 */
export const toEnglishWords = (number: NumericInput, options: EnglishWordsOptions = {}): string => {
  const parsed = parseDecimal(number)

  return parsed === null ? "" : englishWords(parsed, options)
}

const isWhole = (parsed: Decimal): boolean => isAllZeros(parsed.fraction)

const nepaliOrdinal = (digits: string, withException: boolean): string => {
  if (digits.length <= HUNDRED_ZEROS) {
    const value = Number(digits)

    // Ordinals 1–4 are irregular; inside a larger number and after ऋण the regular form is used.
    if (value < 5 && withException) {
      return NEPALI_ORDINALS_EXCEPTIONS[value] || ""
    }

    return NEPALI_ORDINALS[value] || ""
  }

  const scale = largestScale(NEPALI_SCALES, digits)
  const count = nepaliInteger(digits.slice(0, digits.length - scale.zeros))
  const rest = stripLeadingZeros(digits.slice(digits.length - scale.zeros))

  if (rest === "0") {
    return `${count} ${scale.label_ordinal}`
  }

  return `${count} ${scale.label_np} ${nepaliOrdinal(rest, false)}`
}

/**
 * Write a whole number as a Nepali ordinal.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 *
 * @returns The ordinal words; `""` for a non-integer or input that is not a number
 *
 * @example
 * toNepaliOrdinal(1) // "पहिलो"
 */
export const toNepaliOrdinal = (number: NumericInput): string => {
  const parsed = parseDecimal(number)

  if (parsed === null || !isWhole(parsed)) {
    return ""
  }

  if (parsed.negative) {
    return `${NEPALI_NEGATIVE} ${nepaliOrdinal(parsed.integer, false)}`
  }

  return nepaliOrdinal(parsed.integer, true)
}

const englishOrdinalWord = (word: string): string => {
  for (const [cardinal, ordinal] of ENGLISH_ORDINAL_EXCEPTIONS) {
    if (word === cardinal) {
      return ordinal
    }
  }

  if (word.endsWith("y")) {
    return `${word.slice(0, -1)}ieth`
  }

  return `${word}th`
}

/**
 * Write a whole number as an English ordinal.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - Scale system, hyphens and "and"
 *
 * @returns The ordinal words; `""` for a non-integer or input that is not a number
 *
 * @example
 * toEnglishOrdinal(21) // "twenty first"
 */
export const toEnglishOrdinal = (number: NumericInput, options: EnglishWordsOptions = {}): string => {
  const parsed = parseDecimal(number)

  if (parsed === null || !isWhole(parsed)) {
    return ""
  }

  const words = englishWords({ ...parsed, fraction: "" }, options)
  const lastWordAt = Math.max(words.lastIndexOf(" "), words.lastIndexOf("-")) + 1

  return words.slice(0, lastWordAt) + englishOrdinalWord(words.slice(lastWordAt))
}

const ordinalDigits = (number: NumericInput): string | null => {
  const parsed = parseDecimal(number)

  if (parsed === null || parsed.negative || !isWhole(parsed)) {
    return null
  }

  return parsed.integer
}

/**
 * Write a whole number as digits with a Nepali ordinal suffix.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - `useNepaliDigits: false` keeps English digits
 *
 * @returns Digits and suffix; `""` for a negative, a non-integer or input that is not a number
 *
 * @example
 * toNepaliOrdinalNumber(5) // "५औं"
 */
export const toNepaliOrdinalNumber = (number: NumericInput, options: OrdinalNumberOptions = {}): string => {
  const { useNepaliDigits = true } = options
  const digits = ordinalDigits(number)

  if (digits === null) {
    return ""
  }

  const suffix = (digits.length === 1 && NEPALI_ORDINAL_SUFFIXES[Number(digits)]) || NEPALI_ORDINAL_SUFFIXES[0] || ""

  return (useNepaliDigits ? toNepaliDigits(digits) : digits) + suffix
}

/**
 * Write a whole number as digits with `st`, `nd`, `rd` or `th`.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - `useNepaliDigits: true` writes the digits in Nepali
 *
 * @returns Digits and suffix; `""` for a negative, a non-integer or input that is not a number
 *
 * @example
 * toEnglishOrdinalNumber(21) // "21st"
 */
export const toEnglishOrdinalNumber = (number: NumericInput, options: OrdinalNumberOptions = {}): string => {
  const { useNepaliDigits = false } = options
  const digits = ordinalDigits(number)

  if (digits === null) {
    return ""
  }

  // 11, 12 and 13 are read "eleventh", "twelfth", "thirteenth", so the tens digit decides first.
  const isTeen = digits.length > 1 && digits[digits.length - 2] === "1"
  const suffix = (!isTeen && ENGLISH_ORDINAL_SUFFIXES[Number(digits[digits.length - 1])]) || ENGLISH_ORDINAL_SUFFIXES[0] || ""

  return (useNepaliDigits ? toNepaliDigits(digits) : digits) + suffix
}

/**
 * Abbreviate a number with its largest scale, the way amounts are written in headlines.
 *
 * @param number - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - Precision and digit script
 *
 * @returns The abbreviated value with its scale label; `""` when the input is not a number
 *
 * @example
 * toDecimalWord(1200000) // "१२ लाख"
 */
export const toDecimalWord = (number: NumericInput, options: DecimalWordOptions = {}): string => {
  const { precision = 2, useNepaliDigits = true } = options
  const parsed = parseDecimal(number)

  if (parsed === null) {
    return ""
  }

  for (const scale of NEPALI_SCALES) {
    if (parsed.integer.length > scale.zeros) {
      const count = shiftDecimal(parsed, -scale.zeros)

      if (isAllZeros(count.fraction)) {
        return `${formatDecimal(count, { useNepaliDigits })} ${scale.label_np}`
      }

      const rounded = decimalToString(roundDecimal(count, readPlaces(precision)))

      return `${useNepaliDigits ? toNepaliDigits(rounded) : rounded} ${scale.label_np}`
    }
  }

  return formatDecimal(parsed, { useNepaliDigits })
}

interface WordReader {
  small: (token: string) => number
  scale: (token: string) => number
  largestScales: number[]
  negative: string
  point: string
}

const readWords = (tokens: string[], reader: WordReader): number => {
  let index = 0
  let negative = false

  if (tokens[0] === reader.negative) {
    negative = true
    index = 1
  }

  let total = 0
  let group = 0
  let lastScale = Infinity
  let canTakeOnes = false
  let groupOpen = false
  let hundredSeen = false
  let sawZero = false
  let integerTokens = 0

  for (; index < tokens.length; index++) {
    const token = tokens[index] || ""

    if (token === reader.point) {
      break
    }

    integerTokens++
    const value = reader.small(token)

    if (value === 0) {
      sawZero = true
      continue
    }

    if (value > 0) {
      const isOnes = value < 10
      const isTens = value >= 20 && value % 10 === 0

      if (groupOpen && !(canTakeOnes && isOnes)) {
        return NaN
      }

      group += value
      groupOpen = true
      canTakeOnes = !canTakeOnes && isTens
      continue
    }

    const zeros = reader.scale(token)

    // Above the largest scale the count itself is written out: "one thousand maha-shankh".
    const multipliesTotal = reader.largestScales.includes(zeros) && zeros > lastScale

    if (zeros < 0 || (group === 0 && !multipliesTotal)) {
      return NaN
    }

    if (zeros === HUNDRED_ZEROS) {
      if (hundredSeen || group > 99) {
        return NaN
      }

      group *= 100
      hundredSeen = true
    } else if (zeros < lastScale) {
      total += group * 10 ** zeros
      lastScale = zeros
      group = 0
      hundredSeen = false
    } else if (multipliesTotal) {
      total = (total + group) * 10 ** zeros
      lastScale = zeros
      group = 0
      hundredSeen = false
    } else {
      return NaN
    }

    groupOpen = false
    canTakeOnes = false
  }

  // Zero is only ever written alone.
  if (integerTokens === 0 || (sawZero && integerTokens !== 1)) {
    return NaN
  }

  total += group

  if (index < tokens.length) {
    let fraction = ""

    for (index++; index < tokens.length; index++) {
      const digit = reader.small(tokens[index] || "")

      if (digit < 0 || digit > 9) {
        return NaN
      }

      fraction += digit
    }

    if (fraction === "") {
      return NaN
    }

    total += Number(`0.${fraction}`)
  }

  return negative && total !== 0 ? -total : total
}

const splitWords = (text: string): string[] => {
  const trimmed = text.trim()

  return trimmed === "" ? [] : trimmed.split(/\s+/)
}

const NEPALI_READER: WordReader = {
  small: (token) => NEPALI_WORDS.indexOf(token),
  scale: (token) => NEPALI_SCALES.find((scale) => scale.label_np === token)?.zeros ?? -1,
  largestScales: [NEPALI_SCALES[0]?.zeros ?? 0],
  negative: NEPALI_NEGATIVE,
  point: NEPALI_DECIMAL_POINT,
}

/**
 * Read a number written in Nepali words, as `toNepaliWords` writes them.
 *
 * @param words - Nepali number words
 *
 * @returns The number; `NaN` for anything else
 *
 * @example
 * parseNepaliWords("एक लाख पच्चीस हजार") // 125000
 */
export const parseNepaliWords = (words: string): number => {
  if (typeof words !== "string") {
    return NaN
  }

  return readWords(splitWords(words), NEPALI_READER)
}

const englishSmallValue = (token: string): number => {
  const ones = ENGLISH_WORDS.ONES.indexOf(token)
  if (ones >= 0) {
    return ones
  }

  const teens = ENGLISH_WORDS.TEENS.indexOf(token)
  if (teens >= 0) {
    return teens + 10
  }

  const tens = ENGLISH_WORDS.TENS.indexOf(token)

  return tens >= 0 ? (tens + 2) * 10 : -1
}

const ENGLISH_READER: WordReader = {
  small: englishSmallValue,
  scale: (token) => {
    return NEPALI_SCALES.find((scale) => scale.label_en === token)?.zeros
      ?? ENGLISH_INTERNATIONAL_SCALES.find((scale) => scale.label_en === token)?.zeros
      ?? -1
  },
  largestScales: [NEPALI_SCALES[0]?.zeros ?? 0, ENGLISH_INTERNATIONAL_SCALES[0]?.zeros ?? 0],
  negative: ENGLISH_NEGATIVE,
  point: ENGLISH_POINT,
}

/**
 * Read a number written in English words, in the Nepali or the international scale system.
 *
 * @param words - English number words; case, hyphens and "and" are ignored
 *
 * @returns The number; `NaN` for anything else
 *
 * @example
 * parseEnglishWords("one lakh twenty five thousand") // 125000
 */
export const parseEnglishWords = (words: string): number => {
  if (typeof words !== "string") {
    return NaN
  }

  const tokens: string[] = []

  for (const token of splitWords(words.toLowerCase())) {
    // A scale label may itself be hyphenated ("maha-shankh"); only other hyphens join two words.
    if (ENGLISH_READER.scale(token) >= 0) {
      tokens.push(token)
    } else if (token !== ENGLISH_AND) {
      tokens.push(...token.split("-"))
    }
  }

  return readWords(tokens, ENGLISH_READER)
}
