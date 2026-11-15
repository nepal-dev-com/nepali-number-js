import {
  CURRENCY_INPUT_SUFFIX,
  CURRENCY_INPUT_SYMBOLS,
  ENGLISH_CURRENCY,
  ENGLISH_NEGATIVE,
  NEPALI_CURRENCY,
  NEPALI_NEGATIVE,
} from "@/constants"
import type { NumericInput } from "@/conversion"
import { type Decimal, decimalToString, parseDecimal, roundDecimal, scanDecimal } from "@/conversion/decimal"
import { formatDecimal } from "@/formatting/internal"
import { toEnglishWords, toNepaliWords } from "@/words"
import type { CurrencyOptions, CurrencyWordsOptions, EnglishCurrencyWordsOptions } from "./types"

const PAISA_PLACES = 2
const PLUS = 43
const MINUS = 45
const UNICODE_MINUS = 0x2212

/**
 * Format an amount with a currency symbol, grouping and paisa.
 *
 * @param amount - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - Digits, paisa, symbol and its position, precision and grouping
 *
 * @returns The formatted amount, a minus sign in front of the whole string; `""` when the input is not a number
 *
 * @example
 * toNepaliCurrency(1234567.89) // "रू १२,३४,५६७.८९"
 */
export const toNepaliCurrency = (amount: NumericInput, options: CurrencyOptions = {}): string => {
  const {
    useNepaliDigits = true,
    showPaisa = true,
    currencySymbol = NEPALI_CURRENCY.symbol,
    precision = 2,
    symbolPosition = "before",
  } = options

  const parsed = parseDecimal(amount)

  if (parsed === null) {
    return ""
  }

  const formatted = formatDecimal(parsed, {
    ...options,
    useNepaliDigits,
    precision: showPaisa ? precision : 0,
    trimZero: !showPaisa,
  })

  const negative = formatted.charCodeAt(0) === MINUS
  const number = negative ? formatted.slice(1) : formatted
  const body = symbolPosition === "after" ? `${number} ${currencySymbol}` : `${currencySymbol} ${number}`

  return negative ? `-${body}` : body
}

interface Amount {
  negative: boolean
  rupees: string
  paisa: string
}

const readAmount = (amount: NumericInput): Amount | null => {
  const parsed = parseDecimal(amount)

  if (parsed === null) {
    return null
  }

  const rounded: Decimal = roundDecimal(parsed, PAISA_PLACES)

  return { negative: rounded.negative, rupees: rounded.integer, paisa: String(Number(rounded.fraction)) }
}

/**
 * Write an amount in Nepali words, as rupees and paisa.
 *
 * @param amount - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - `only: true` appends the closing word of a cheque
 *
 * @returns The amount in words; `""` when the input is not a number
 *
 * @example
 * toNepaliCurrencyWords(12.5) // "बाह्र रुपैयाँ पचास पैसा"
 */
export const toNepaliCurrencyWords = (amount: NumericInput, options: CurrencyWordsOptions = {}): string => {
  const { only = false } = options
  const read = readAmount(amount)

  if (read === null) {
    return ""
  }

  const parts: string[] = []

  if (read.negative) {
    parts.push(NEPALI_NEGATIVE)
  }

  if (read.rupees !== "0" || read.paisa === "0") {
    parts.push(toNepaliWords(read.rupees), NEPALI_CURRENCY.rupee)
  }

  if (read.paisa !== "0") {
    parts.push(toNepaliWords(read.paisa), NEPALI_CURRENCY.paisa)
  }

  if (only) {
    parts.push(NEPALI_CURRENCY.only)
  }

  return parts.join(" ")
}

/**
 * Write an amount in English words, as rupees and paisa.
 *
 * @param amount - A number, a bigint, or a string in English, Nepali or mixed digits
 * @param options - `only`, and the options of `toEnglishWords`
 *
 * @returns The amount in lower-case words; `""` when the input is not a number
 *
 * @example
 * toEnglishCurrencyWords(12.5) // "twelve rupees fifty paisa"
 */
export const toEnglishCurrencyWords = (amount: NumericInput, options: EnglishCurrencyWordsOptions = {}): string => {
  const { only = false, ...words } = options
  const read = readAmount(amount)

  if (read === null) {
    return ""
  }

  const parts: string[] = []

  if (read.negative) {
    parts.push(ENGLISH_NEGATIVE)
  }

  if (read.rupees !== "0" || read.paisa === "0") {
    parts.push(toEnglishWords(read.rupees, words), read.rupees === "1" ? ENGLISH_CURRENCY.rupee : ENGLISH_CURRENCY.rupees)
  }

  if (read.paisa !== "0") {
    parts.push(toEnglishWords(read.paisa, words), ENGLISH_CURRENCY.paisa)
  }

  if (only) {
    parts.push(ENGLISH_CURRENCY.only)
  }

  return parts.join(" ")
}

const isSign = (code: number): boolean => code === PLUS || code === MINUS || code === UNICODE_MINUS

const dropSymbol = (text: string, atEnd: boolean): string => {
  const lower = text.toLowerCase()

  for (const symbol of CURRENCY_INPUT_SYMBOLS) {
    const wanted = symbol.toLowerCase()

    if (atEnd && lower.endsWith(wanted)) {
      return text.slice(0, text.length - symbol.length).trimEnd()
    }

    if (!atEnd && lower.startsWith(wanted)) {
      return text.slice(symbol.length).trimStart()
    }
  }

  return text
}

/**
 * Read a formatted rupee amount back into a number.
 *
 * @param text - An amount with an optional sign, a recognised symbol before or after, or a trailing `/-`
 *
 * @returns The amount; `NaN` for anything else
 *
 * @example
 * parseNepaliCurrency("Rs. 1,234/-") // 1234
 */
export const parseNepaliCurrency = (text: string): number => {
  if (typeof text !== "string") {
    return NaN
  }

  let rest = text.trim()
  let negative = false
  const signed = isSign(rest.charCodeAt(0))

  if (signed) {
    negative = rest.charCodeAt(0) !== PLUS
    rest = rest.slice(1).trimStart()
  }

  rest = dropSymbol(rest, false)

  // The sign may stand before the symbol or before the number, never both.
  if (signed && isSign(rest.charCodeAt(0))) {
    return NaN
  }

  rest = rest.endsWith(CURRENCY_INPUT_SUFFIX)
    ? rest.slice(0, rest.length - CURRENCY_INPUT_SUFFIX.length).trimEnd()
    : dropSymbol(rest, true)

  const parsed = scanDecimal(rest)

  if (parsed === null) {
    return NaN
  }

  const value = Number(decimalToString(parsed))

  return negative && value !== 0 ? -value : value
}
