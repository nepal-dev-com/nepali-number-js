import type { NumericInput } from "@/conversion"
import { compareDecimal, type Decimal, decimalToString, digitValue, isNepaliDigitCode, parseDecimal } from "@/conversion/decimal"
import { toEnglishWords, toNepaliWords } from "@/words"
import type { NumberMatch, SpellOutOptions } from "./types"

const COMMA = 44
const POINT = 46

const isDigitAt = (text: string, index: number): boolean => index < text.length && digitValue(text.charCodeAt(index)) >= 0

// One left-to-right pass with no regular expression, so time stays proportional to the length — ADR-0018.
const scanNumbers = (text: string): NumberMatch[] => {
  const matches: NumberMatch[] = []
  let index = 0

  while (index < text.length) {
    if (!isDigitAt(text, index)) {
      index++
      continue
    }

    const start = index
    let seenPoint = false
    let hasEnglish = false
    let hasNepali = false

    while (index < text.length) {
      const code = text.charCodeAt(index)

      if (digitValue(code) >= 0) {
        if (isNepaliDigitCode(code)) {
          hasNepali = true
        } else {
          hasEnglish = true
        }
      } else if (code === POINT && !seenPoint && isDigitAt(text, index + 1)) {
        seenPoint = true
      } else if (!(code === COMMA && !seenPoint && isDigitAt(text, index + 1))) {
        break
      }

      index++
    }

    const match = text.slice(start, index)
    const parsed = parseDecimal(match)
    let system: NumberMatch["system"] = "english"

    if (hasEnglish && hasNepali) {
      system = "mixed"
    } else if (hasNepali) {
      system = "nepali"
    }

    matches.push({
      match,
      value: parsed === null ? NaN : Number(decimalToString(parsed)),
      index: start,
      system,
    })
  }

  return matches
}

/**
 * Find every number inside a text.
 *
 * @param text - Any text
 *
 * @returns One entry per number, in order, with its text, value, UTF-16 offset and script; `[]` when there is none
 *
 * @example
 * findNumbers("Call 9841-123456") // two matches: "9841" at 5 and "123456" at 10
 */
export const findNumbers = (text: string): NumberMatch[] => {
  return typeof text === "string" ? scanNumbers(text) : []
}

/**
 * List the values of the numbers inside a text.
 *
 * @param text - Any text
 *
 * @returns The value of each number, in order; `[]` when there is none
 *
 * @example
 * extractNumbers("Call 9841-123456 at 5pm") // [9841, 123456, 5]
 */
export const extractNumbers = (text: string): number[] => findNumbers(text).map((match) => match.value)

/**
 * Replace each number inside a text with what the replacer returns for it.
 *
 * @param text - Any text
 * @param replacer - Called once per number; its result is inserted as text, unescaped
 *
 * @returns The text with every number replaced; `""` when the text is not a string
 *
 * @example
 * replaceNumbers("Total 1234567 people", (m) => formatNepaliNumber(m.value)) // "Total १२,३४,५६७ people"
 */
export const replaceNumbers = (text: string, replacer: (match: NumberMatch) => string): string => {
  if (typeof text !== "string") {
    return ""
  }

  let result = ""
  let end = 0

  for (const match of scanNumbers(text)) {
    result += text.slice(end, match.index) + replacer(match)
    end = match.index + match.match.length
  }

  return end === 0 ? text : result + text.slice(end)
}

/**
 * Write each number inside a text as words.
 *
 * @param text - Any text
 * @param options - `words: "english"` for English words; Nepali by default
 *
 * @returns The text with every number spelled out; `""` when the text is not a string
 *
 * @example
 * spellOutNumbers("I have 21 books", { words: "english" }) // "I have twenty one books"
 */
export const spellOutNumbers = (text: string, options: SpellOutOptions = {}): string => {
  const { words = "nepali" } = options

  // The digits as written are spelled, not the float value, so long numbers stay exact.
  return replaceNumbers(text, (match) => (words === "english" ? toEnglishWords(match.match) : toNepaliWords(match.match)))
}

/**
 * Compare two numbers written in any accepted form, exactly.
 *
 * @param a - Left value
 * @param b - Right value
 *
 * @returns `-1`, `0` or `1`; `NaN` when either value is not a number
 *
 * @example
 * compareNumbers("१२३", 123) // 0
 */
export const compareNumbers = (a: NumericInput, b: NumericInput): number => {
  const left = parseDecimal(a)
  const right = parseDecimal(b)

  return left === null || right === null ? NaN : compareDecimal(left, right)
}

/**
 * Sort numbers written in any accepted form by value.
 *
 * @param values - Numbers, bigints or strings in either script
 * @param order - `"asc"` or `"desc"`
 *
 * @returns A new array of the same elements; values that are not numbers go last in their original order; `[]` when `values` is not an array
 *
 * @example
 * sortNumbers(["१०", 9, "1,000", "२.५"]) // ["२.५", 9, "१०", "1,000"]
 */
export const sortNumbers = <T extends NumericInput>(values: readonly T[], order: "asc" | "desc" = "asc"): T[] => {
  if (!Array.isArray(values)) {
    return []
  }

  const valid: { value: T, parsed: Decimal, position: number }[] = []
  const invalid: T[] = []

  values.forEach((value: T, position: number) => {
    const parsed = parseDecimal(value)

    if (parsed === null) {
      invalid.push(value)
    } else {
      valid.push({ value, parsed, position })
    }
  })

  const direction = order === "desc" ? -1 : 1

  // The position breaks ties so that equal values keep their order in either direction.
  valid.sort((left, right) => direction * compareDecimal(left.parsed, right.parsed) || left.position - right.position)

  return [...valid.map((entry) => entry.value), ...invalid]
}
