import { describe, expect, test } from "bun:test"
import {
  parseEnglishWords,
  parseNepaliWords,
  toDecimalWord,
  toEnglishOrdinal,
  toEnglishOrdinalNumber,
  toEnglishWords,
  toNepaliOrdinal,
  toNepaliOrdinalNumber,
  toNepaliWords,
} from "."

describe("Words Functions", () => {
  describe("toNepaliWords", () => {
    test("converts single digits", () => {
      expect(toNepaliWords(0)).toBe("शून्य")
      expect(toNepaliWords(1)).toBe("एक")
      expect(toNepaliWords(5)).toBe("पाँच")
      expect(toNepaliWords(9)).toBe("नौ")
    })

    test("converts teen numbers", () => {
      expect(toNepaliWords(10)).toBe("दश")
      expect(toNepaliWords(11)).toBe("एघार")
      expect(toNepaliWords(15)).toBe("पन्ध्र")
      expect(toNepaliWords(19)).toBe("उन्नाइस")
      expect(toNepaliWords(20)).toBe("बीस")
    })

    test("converts tens", () => {
      expect(toNepaliWords(21)).toBe("एक्काईस")
      expect(toNepaliWords(30)).toBe("तीस")
      expect(toNepaliWords(45)).toBe("पैंतालीस")
      expect(toNepaliWords(99)).toBe("उनान्सय")
    })

    test("converts hundreds", () => {
      expect(toNepaliWords(100)).toBe("एक सय")
      expect(toNepaliWords(101)).toBe("एक सय एक")
      expect(toNepaliWords(250)).toBe("दुई सय पचास")
      expect(toNepaliWords(999)).toBe("नौ सय उनान्सय")
    })

    test("converts thousands", () => {
      expect(toNepaliWords(1000)).toBe("एक हजार")
      expect(toNepaliWords(1001)).toBe("एक हजार एक")
      expect(toNepaliWords(2500)).toBe("दुई हजार पाँच सय")
      expect(toNepaliWords(99999)).toBe("उनान्सय हजार नौ सय उनान्सय")
    })

    test("converts lakhs", () => {
      expect(toNepaliWords(100000)).toBe("एक लाख")
      expect(toNepaliWords(150000)).toBe("एक लाख पचास हजार")
      expect(toNepaliWords(999999)).toBe("नौ लाख उनान्सय हजार नौ सय उनान्सय")
    })

    test("converts crores", () => {
      expect(toNepaliWords(10000000)).toBe("एक करोड")
      expect(toNepaliWords(12345678)).toBe("एक करोड तेईस लाख पैंतालीस हजार छ सय अठहत्तर")
    })

    test("handles negative numbers", () => {
      expect(toNepaliWords(-1)).toBe("ऋण एक")
      expect(toNepaliWords(-123)).toBe("ऋण एक सय तेईस")
      expect(toNepaliWords(-1000)).toBe("ऋण एक हजार")
    })

    test("handles edge cases", () => {
      expect(toNepaliWords(21)).toBe("एक्काईस")
      expect(toNepaliWords(101)).toBe("एक सय एक")
      expect(toNepaliWords(1001)).toBe("एक हजार एक")
    })

    test("handles very large numbers", () => {
      expect(toNepaliWords(123456789)).toBe("बाह्र करोड चौंतीस लाख छपन्न हजार सात सय उनान्नब्बे")
    })

    test("handles boundary values", () => {
      expect(toNepaliWords(20)).toBe("बीस")
      expect(toNepaliWords(100)).toBe("एक सय")
      expect(toNepaliWords(1000)).toBe("एक हजार")
      expect(toNepaliWords(100000)).toBe("एक लाख")
      expect(toNepaliWords(10000000)).toBe("एक करोड")
    })
  })

  describe("toEnglishWords", () => {
    test("converts single digits", () => {
      expect(toEnglishWords(0)).toBe("zero")
      expect(toEnglishWords(1)).toBe("one")
      expect(toEnglishWords(5)).toBe("five")
      expect(toEnglishWords(9)).toBe("nine")
    })

    test("converts teen numbers", () => {
      expect(toEnglishWords(10)).toBe("ten")
      expect(toEnglishWords(11)).toBe("eleven")
      expect(toEnglishWords(15)).toBe("fifteen")
      expect(toEnglishWords(19)).toBe("nineteen")
    })

    test("converts tens", () => {
      expect(toEnglishWords(20)).toBe("twenty")
      expect(toEnglishWords(21)).toBe("twenty one")
      expect(toEnglishWords(30)).toBe("thirty")
      expect(toEnglishWords(99)).toBe("ninety nine")
    })

    test("converts hundreds", () => {
      expect(toEnglishWords(100)).toBe("one hundred")
      expect(toEnglishWords(101)).toBe("one hundred one")
      expect(toEnglishWords(250)).toBe("two hundred fifty")
      expect(toEnglishWords(999)).toBe("nine hundred ninety nine")
    })

    test("converts thousands", () => {
      expect(toEnglishWords(1000)).toBe("one thousand")
      expect(toEnglishWords(1001)).toBe("one thousand one")
      expect(toEnglishWords(2500)).toBe("two thousand five hundred")
    })

    test("handles negative numbers", () => {
      expect(toEnglishWords(-1)).toBe("negative one")
      expect(toEnglishWords(-123)).toBe("negative one hundred twenty three")
    })

    test("handles very large numbers fallback", () => {
      expect(toEnglishWords(1234567890)).toBe("one arab twenty three crore forty five lakh sixty seven thousand eight hundred ninety")
    })

    test("handles edge cases", () => {
      expect(toEnglishWords(11)).toBe("eleven")
      expect(toEnglishWords(12)).toBe("twelve")
      expect(toEnglishWords(13)).toBe("thirteen")
    })
  })

  describe("toNepaliOrdinal", () => {
    test("formats basic ordinals", () => {
      expect(toNepaliOrdinal(1)).toBe("पहिलो")
      expect(toNepaliOrdinal(2)).toBe("दोस्रो")
      expect(toNepaliOrdinal(3)).toBe("तेस्रो")
      expect(toNepaliOrdinal(4)).toBe("चौथो")
      expect(toNepaliOrdinal(5)).toBe("पाँचौं")
      expect(toNepaliOrdinal(10)).toBe("दशौं")
    })

    test("formats larger ordinals", () => {
      expect(toNepaliOrdinal(11)).toBe("एघारौं")
      expect(toNepaliOrdinal(21)).toBe("एक्काईसौं")
      expect(toNepaliOrdinal(100)).toBe("एक सयौं")
    })

    test("handles edge cases", () => {
      expect(toNepaliOrdinal(0)).toBe("शून्यौं")
      expect(toNepaliOrdinal(25)).toBe("पच्चीसौं")
      expect(toNepaliOrdinal(101)).toBe("एक सय एकौं")
    })

    test("handles negative numbers", () => {
      expect(toNepaliOrdinal(-1)).toBe("ऋण एकौं")
      expect(toNepaliOrdinal(-5)).toBe("ऋण पाँचौं")
    })
  })

  describe("toDecimalWord", () => {
    test("converts to decimal words", () => {
      expect(toDecimalWord(10000000)).toBe("१ करोड")
      expect(toDecimalWord(15000000)).toBe("१.५० करोड")
      expect(toDecimalWord(20000000)).toBe("२ करोड")
    })

    test("handles numbers less than 1 crore", () => {
      expect(toDecimalWord(5000000)).toBe("५० लाख")
      expect(toDecimalWord(500000)).toBe("५ लाख")
      expect(toDecimalWord(50000)).toBe("५० हजार")
    })

    test("handles multiple crores", () => {
      expect(toDecimalWord(50000000)).toBe("५ करोड")
      expect(toDecimalWord(123456789)).toBe("१२.३५ करोड")
    })

    test("handles exact crore multiples", () => {
      expect(toDecimalWord(30000000)).toBe("३ करोड")
      expect(toDecimalWord(100000000)).toBe("१० करोड")
    })

    test("handles zero and small numbers", () => {
      expect(toDecimalWord(0)).toBe("०")
      expect(toDecimalWord(1)).toBe("१")
      expect(toDecimalWord(10)).toBe("१०")
      expect(toDecimalWord(99)).toBe("९९")
      expect(toDecimalWord(100)).toBe("१ सय")
      expect(toDecimalWord(1000)).toBe("१ हजार")
    })
  })
  describe("ADR-0014: decimals, exact big numbers and invalid input", () => {
    test("reads a fraction digit by digit after दशमलव", () => {
      expect(toNepaliWords(12.5)).toBe("बाह्र दशमलव पाँच")
      expect(toNepaliWords(3.14)).toBe("तीन दशमलव एक चार")
      expect(toNepaliWords(0.05)).toBe("शून्य दशमलव शून्य पाँच")
      expect(toNepaliWords("12.50")).toBe("बाह्र दशमलव पाँच")
      expect(toNepaliWords("12.0")).toBe("बाह्र")
      expect(toNepaliWords(-0.5)).toBe("ऋण शून्य दशमलव पाँच")
      expect(toNepaliWords("१२.५")).toBe("बाह्र दशमलव पाँच")
    })

    test("is exact above 2^53 and recurses above महाशंख", () => {
      expect(toNepaliWords(10n ** 19n)).toBe("एक महाशंख")
      expect(toNepaliWords(10n ** 21n)).toBe("एक सय महाशंख")
      expect(toNepaliWords(10n ** 22n)).toBe("एक हजार महाशंख")
      expect(toNepaliWords(12345678901234567890n)).toBe(
        "एक महाशंख तेईस शंख पैंतालीस पद्म सतसट्ठी नील उनान्नब्बे खर्ब एक अर्ब तेईस करोड पैंतालीस लाख सतसट्ठी हजार आठ सय नब्बे",
      )
      expect(toNepaliWords("12345678901234567890")).toBe(toNepaliWords(12345678901234567890n))
      expect(toNepaliWords("9007199254740993")).toEndWith("त्रियानब्बे")
      expect(toNepaliWords(100001)).toBe("एक लाख एक")
    })

    test("returns an empty string for input that is not a number", () => {
      for (const invalid of ["abc", "", "12abc", "1.2.3"]) {
        expect(toNepaliWords(invalid)).toBe("")
        expect(toEnglishWords(invalid)).toBe("")
        expect(toNepaliOrdinal(invalid)).toBe("")
        expect(toEnglishOrdinal(invalid)).toBe("")
        expect(toNepaliOrdinalNumber(invalid)).toBe("")
        expect(toEnglishOrdinalNumber(invalid)).toBe("")
        expect(toDecimalWord(invalid)).toBe("")
      }
      expect(toNepaliWords(NaN)).toBe("")
      expect(toNepaliWords(Infinity)).toBe("")
      expect(toNepaliWords(null as unknown as string)).toBe("")
    })

    test("spells a 100 000-digit number without failing", () => {
      const started = performance.now()
      expect(toNepaliWords("9".repeat(2000)).length).toBeGreaterThan(2000)
      const huge = "9".repeat(300000)
      expect(toNepaliWords(huge).length).toBeGreaterThan(300000)
      expect(toEnglishWords(huge).length).toBeGreaterThan(300000)
      expect(toEnglishWords(huge, { system: "international" }).length).toBeGreaterThan(300000)
      expect(toNepaliOrdinal(huge)).toEndWith("उनान्सयौं")
      expect(toNepaliWords(10n ** 38n)).toBe("एक महाशंख महाशंख")
      expect(toNepaliWords(10n ** 38n + 5n * 10n ** 19n + 7n)).toBe("एक महाशंख पाँच महाशंख सात")
      expect(toNepaliWords("9".repeat(100000) + "x")).toBe("")
      expect(performance.now() - started).toBeLessThan(2000)
    })
  })

  describe("toEnglishWords options", () => {
    test("reads decimals after point", () => {
      expect(toEnglishWords(12.5)).toBe("twelve point five")
      expect(toEnglishWords(-0.05)).toBe("negative zero point zero five")
    })

    test("uses the international system", () => {
      expect(toEnglishWords(1234567, { system: "international" })).toBe(
        "one million two hundred thirty four thousand five hundred sixty seven",
      )
      expect(toEnglishWords(1000000000, { system: "international" })).toBe("one billion")
      expect(toEnglishWords(10n ** 33n, { system: "international" })).toBe("one decillion")
      expect(toEnglishWords(10n ** 36n, { system: "international" })).toBe("one thousand decillion")
      expect(toEnglishWords(100000, { system: "international" })).toBe("one hundred thousand")
    })

    test("hyphenates and adds and", () => {
      expect(toEnglishWords(23, { hyphenate: true })).toBe("twenty-three")
      expect(toEnglishWords(20, { hyphenate: true })).toBe("twenty")
      expect(toEnglishWords(123, { and: true })).toBe("one hundred and twenty three")
      expect(toEnglishWords(100, { and: true })).toBe("one hundred")
      expect(toEnglishWords(1105, { and: true, hyphenate: true })).toBe("one thousand one hundred and five")
      expect(toEnglishWords(1e21)).toBe("one hundred maha-shankh")
    })
  })

  describe("toNepaliOrdinal (ADR-0014)", () => {
    test("rejects non-integers and stays exact for bigint", () => {
      expect(toNepaliOrdinal(12.5)).toBe("")
      expect(toNepaliOrdinal("5.0")).toBe("पाँचौं")
      expect(toNepaliOrdinal(-2)).toBe("ऋण दुइऔं")
      expect(toNepaliOrdinal(10n ** 19n)).toBe("एक महाशंखौं")
      expect(toNepaliOrdinal(12345678)).toBe("एक करोड तेईस लाख पैंतालीस हजार छ सय अठहत्तरौं")
    })
  })

  describe("toEnglishOrdinal", () => {
    test("makes the last word ordinal", () => {
      const cases: [number | string, string][] = [
        [1, "first"], [2, "second"], [3, "third"], [4, "fourth"], [5, "fifth"], [8, "eighth"], [9, "ninth"],
        [12, "twelfth"], [20, "twentieth"], ["२१", "twenty first"], [100, "one hundredth"],
        [101, "one hundred first"], [1234567, "twelve lakh thirty four thousand five hundred sixty seventh"],
        [10000000, "one croreth"], [0, "zeroth"], [-1, "negative first"], [40, "fortieth"], [13, "thirteenth"],
      ]
      for (const [input, expected] of cases) {
        expect(toEnglishOrdinal(input)).toBe(expected)
      }
    })

    test("respects the word options and rejects non-integers", () => {
      expect(toEnglishOrdinal(21, { hyphenate: true })).toBe("twenty-first")
      expect(toEnglishOrdinal(1000000, { system: "international" })).toBe("one millionth")
      expect(toEnglishOrdinal(12.5)).toBe("")
    })
  })

  describe("toNepaliOrdinalNumber", () => {
    test("adds the Nepali ordinal suffix to the digits", () => {
      expect(toNepaliOrdinalNumber(1)).toBe("१लो")
      expect(toNepaliOrdinalNumber(2)).toBe("२रो")
      expect(toNepaliOrdinalNumber(3)).toBe("३रो")
      expect(toNepaliOrdinalNumber(4)).toBe("४थो")
      expect(toNepaliOrdinalNumber(5)).toBe("५औं")
      expect(toNepaliOrdinalNumber("२१")).toBe("२१औं")
      expect(toNepaliOrdinalNumber(11)).toBe("११औं")
      expect(toNepaliOrdinalNumber(100)).toBe("१००औं")
      expect(toNepaliOrdinalNumber(12345678)).toBe("१२३४५६७८औं")
      expect(toNepaliOrdinalNumber(5, { useNepaliDigits: false })).toBe("5औं")
      expect(toNepaliOrdinalNumber(0)).toBe("०औं")
    })

    test("rejects negatives and non-integers", () => {
      expect(toNepaliOrdinalNumber(-5)).toBe("")
      expect(toNepaliOrdinalNumber(12.5)).toBe("")
    })
  })

  describe("toEnglishOrdinalNumber", () => {
    test("adds st, nd, rd or th by the last two digits", () => {
      const cases: [number | string, string][] = [
        [1, "1st"], [2, "2nd"], [3, "3rd"], [4, "4th"], [11, "11th"], [12, "12th"], [13, "13th"], ["२१", "21st"],
        [102, "102nd"], [112, "112th"], [12345678, "12345678th"], [0, "0th"], [23, "23rd"], [111, "111th"],
      ]
      for (const [input, expected] of cases) {
        expect(toEnglishOrdinalNumber(input)).toBe(expected)
      }
      expect(toEnglishOrdinalNumber(21, { useNepaliDigits: true })).toBe("२१st")
    })

    test("rejects negatives and non-integers", () => {
      expect(toEnglishOrdinalNumber(-5)).toBe("")
      expect(toEnglishOrdinalNumber(12.5)).toBe("")
    })
  })

  describe("toDecimalWord (ADR-0014)", () => {
    test("abbreviates negatives and takes options", () => {
      expect(toDecimalWord(-1200000)).toBe("-१२ लाख")
      expect(toDecimalWord(-1250000)).toBe("-१२.५० लाख")
      expect(toDecimalWord(1250000, { precision: 1 })).toBe("१२.५ लाख")
      expect(toDecimalWord(1250000, { precision: 500 })).toBe("१२.५० लाख")
      expect(toDecimalWord(1200000, { useNepaliDigits: false })).toBe("12 लाख")
      expect(toDecimalWord(1250000, { useNepaliDigits: false })).toBe("12.50 लाख")
      expect(toDecimalWord(50, { useNepaliDigits: false })).toBe("50")
    })

    test("keeps the documented positive outputs", () => {
      const cases: [number | string, string][] = [
        [1200000, "१२ लाख"], ["१२,००,०००", "१२ लाख"], [25000000, "२.५० करोड"], [12345678, "१.२३ करोड"],
        [1000000000, "१ अर्ब"], [100000, "१ लाख"], [1234, "१.२३ हजार"], [150, "१.५० सय"], [99, "९९"],
        [99.5, "९९.५०"], [0, "०"],
      ]
      for (const [input, expected] of cases) {
        expect(toDecimalWord(input)).toBe(expected)
      }
      expect(toDecimalWord(10n ** 23n)).toBe("१०,००० महाशंख")
    })
  })

  describe("parseNepaliWords", () => {
    test("reads what toNepaliWords writes", () => {
      expect(parseNepaliWords("एक सय तेईस")).toBe(123)
      expect(parseNepaliWords("एक लाख पच्चीस हजार")).toBe(125000)
      expect(parseNepaliWords("एक करोड तेईस लाख पैंतालीस हजार छ सय अठहत्तर")).toBe(12345678)
      expect(parseNepaliWords("शून्य")).toBe(0)
      expect(parseNepaliWords("ऋण पैंतालीस")).toBe(-45)
      expect(parseNepaliWords("बाह्र दशमलव पाँच")).toBe(12.5)
      expect(parseNepaliWords("शून्य दशमलव शून्य पाँच")).toBe(0.05)
      expect(parseNepaliWords("  एक   सय  ")).toBe(100)
      expect(parseNepaliWords("एक सय महाशंख")).toBe(1e21)
      expect(parseNepaliWords("एक हजार महाशंख")).toBe(1e22)
    })

    test("round-trips with toNepaliWords", () => {
      for (const value of [0, 7, 99, 100, 101, 999, 1000, 12345, 100000, 9999999, 123456789012, -3050, 4.25]) {
        expect(parseNepaliWords(toNepaliWords(value))).toBe(value)
      }
    })

    test("returns NaN for anything else", () => {
      for (const invalid of [
        "abc", "", "   ", "एक एक", "सय", "एक सय सय", "हजार एक", "एक हजार एक लाख", "एक हजार दुई हजार",
        "शून्य एक", "एक शून्य", "एक दशमलव", "एक दशमलव बाह्र", "दशमलव पाँच", "ऋण", "एक सय तेईस abc", "एक सय दुई सय",
      ]) {
        expect(parseNepaliWords(invalid)).toBeNaN()
      }
      expect(parseNepaliWords(null as unknown as string)).toBeNaN()
    })
  })

  describe("parseEnglishWords", () => {
    test("reads both scale systems, hyphens, and, and any case", () => {
      expect(parseEnglishWords("one hundred twenty three")).toBe(123)
      expect(parseEnglishWords("one lakh twenty five thousand")).toBe(125000)
      expect(parseEnglishWords("One Crore")).toBe(10000000)
      expect(parseEnglishWords("one million")).toBe(1000000)
      expect(parseEnglishWords("twenty-three")).toBe(23)
      expect(parseEnglishWords("one hundred and five")).toBe(105)
      expect(parseEnglishWords("zero")).toBe(0)
      expect(parseEnglishWords("negative five")).toBe(-5)
      expect(parseEnglishWords("twelve point five")).toBe(12.5)
      expect(parseEnglishWords("one hundred maha-shankh")).toBe(1e21)
      expect(parseEnglishWords("two billion three hundred million")).toBe(2300000000)
      expect(parseEnglishWords("nineteen")).toBe(19)
    })

    test("round-trips with toEnglishWords in both systems", () => {
      for (const value of [0, 7, 19, 20, 99, 100, 101, 12345, 100000, 9999999, 123456789012, -3050, 4.25]) {
        expect(parseEnglishWords(toEnglishWords(value))).toBe(value)
        expect(parseEnglishWords(toEnglishWords(value, { system: "international", hyphenate: true, and: true }))).toBe(value)
      }
    })

    test("returns NaN for anything else", () => {
      for (const invalid of [
        "abc", "", "one one", "twenty twenty", "twenty eleven", "eleven one", "hundred", "one hundred hundred",
        "thousand one", "one thousand one lakh", "one point", "one point twelve", "negative", "zero one", "first",
      ]) {
        expect(parseEnglishWords(invalid)).toBeNaN()
      }
      expect(parseEnglishWords(null as unknown as string)).toBeNaN()
    })
  })
})
