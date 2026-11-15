import { describe, expect, test } from "bun:test"
import * as api from "@/nepali-number"
import type {
  CurrencyOptions,
  CurrencyWordsOptions,
  DecimalWordOptions,
  EnglishCurrencyWordsOptions,
  EnglishWordsOptions,
  FormatOptions,
  LandUnit,
  NumberMatch,
  NumberSystem,
  NumericInput,
  OrdinalNumberOptions,
  PadOptions,
  PercentOptions,
  SpellOutOptions,
  UnitFormatOptions,
  WeightUnit,
} from "@/nepali-number"

// Compiles only while every public type is re-exported from the barrel — ADR-0012.
export type PublicTypes = [
  CurrencyOptions, CurrencyWordsOptions, DecimalWordOptions, EnglishCurrencyWordsOptions, EnglishWordsOptions,
  FormatOptions, LandUnit, NumberMatch, NumberSystem, NumericInput, OrdinalNumberOptions, PadOptions,
  PercentOptions, SpellOutOptions, UnitFormatOptions, WeightUnit,
]

describe("public barrel", () => {
  test("exports exactly the documented functions and no internals", () => {
    expect(Object.keys(api).sort()).toEqual([
      "addNepaliCommas", "compareNumbers", "convert", "convertLandArea", "convertWeight", "detectNumberSystem",
      "extractNumbers", "findNumbers", "formatBigha", "formatNepaliNumber", "formatPercent", "formatRopani",
      "formatTola", "isEnglishDigit", "isMixedNumber", "isNepaliDigit", "isValidNumber", "normalize", "padZeros",
      "parseEnglishWords", "parseLandArea", "parseNepaliCurrency", "parseNepaliNumber", "parseNepaliWords",
      "removeFormatting", "replaceNumbers", "roundNepali", "sortNumbers", "spellOutNumbers", "toDecimalWord",
      "toEnglish", "toEnglishCurrencyWords", "toEnglishOrdinal", "toEnglishOrdinalNumber", "toEnglishWords",
      "toNepali", "toNepaliCurrency", "toNepaliCurrencyWords", "toNepaliFraction", "toNepaliFractionWords",
      "toNepaliMultiplier", "toNepaliOrdinal", "toNepaliOrdinalNumber", "toNepaliWords", "validateNepaliNumber",
    ])
  })

  test("every export is a function", () => {
    for (const value of Object.values(api)) {
      expect(typeof value).toBe("function")
    }
  })
})
