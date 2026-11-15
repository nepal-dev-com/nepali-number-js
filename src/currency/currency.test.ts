import { describe, expect, test } from "bun:test"
import { parseNepaliCurrency, toEnglishCurrencyWords, toNepaliCurrency, toNepaliCurrencyWords } from "."

describe("Currency Functions", () => {
  describe("toNepaliCurrency", () => {
    test("formats basic currency", () => {
      expect(toNepaliCurrency(100)).toBe("रू १००.००")
      expect(toNepaliCurrency(1234.56)).toBe("रू १,२३४.५६")
    })

    test("respects useNepaliDigits option", () => {
      expect(toNepaliCurrency(100, { useNepaliDigits: false })).toBe("रू 100.00")
      expect(toNepaliCurrency(1234.56, { useNepaliDigits: false })).toBe("रू 1,234.56")
    })

    test("respects showPaisa option", () => {
      expect(toNepaliCurrency(100, { showPaisa: false })).toBe("रू १००")
      expect(toNepaliCurrency(100.50, { showPaisa: false })).toBe("रू १०१")
      expect(toNepaliCurrency(100.50, { showPaisa: true })).toBe("रू १००.५०")
    })

    test("respects custom currency symbol", () => {
      expect(toNepaliCurrency(100, { currencySymbol: "NPR" })).toBe("NPR १००.००")
      expect(toNepaliCurrency(100, { currencySymbol: "$" })).toBe("$ १००.००")
    })

    test("handles zero amount", () => {
      expect(toNepaliCurrency(0)).toBe("रू ०.००")
      expect(toNepaliCurrency(0, { showPaisa: false })).toBe("रू ०")
    })

    test("handles negative amounts", () => {
      expect(toNepaliCurrency(-100)).toBe("-रू १००.००")
      expect(toNepaliCurrency(-1234.56)).toBe("-रू १,२३४.५६")
    })

    test("handles precision option", () => {
      expect(toNepaliCurrency(100.123, { precision: 3 })).toBe("रू १००.१२३")
      expect(toNepaliCurrency(100.999, { precision: 0 })).toBe("रू १०१")
      expect(toNepaliCurrency(100.999, { precision: 1 })).toBe("रू १०१.०")
    })

    test("handles very large amounts", () => {
      expect(toNepaliCurrency(12345678.90)).toBe("रू १,२३,४५,६७८.९०")
    })

    test("handles very small amounts", () => {
      expect(toNepaliCurrency(0.01)).toBe("रू ०.०१")
      expect(toNepaliCurrency(0.001, { precision: 3 })).toBe("रू ०.००१")
    })

    test("formats with default settings", () => {
      expect(toNepaliCurrency(100)).toBe("रू १००.००")
      expect(toNepaliCurrency(1234.56)).toBe("रू १,२३४.५६")
    })

    test("handles zero", () => {
      expect(toNepaliCurrency(0)).toBe("रू ०.००")
    })

    test("handles negative amounts", () => {
      expect(toNepaliCurrency(-500.25)).toBe("-रू ५००.२५")
    })

    test("handles large amounts", () => {
      expect(toNepaliCurrency(1000000)).toBe("रू १०,००,०००.००")
    })

    test("handles decimal precision", () => {
      expect(toNepaliCurrency(100.1)).toBe("रू १००.१०")
      expect(toNepaliCurrency(100.99)).toBe("रू १००.९९")
    })

    test("removes trailing zeros appropriately", () => {
      expect(toNepaliCurrency(100.00, {showPaisa: false})).toBe("रू १००")
      expect(toNepaliCurrency(100.50, {precision: 1})).toBe("रू १००.५")
    })
  })

  describe("toNepaliCurrencyWords", () => {
    test("converts basic amounts to words", () => {
      expect(toNepaliCurrencyWords(1)).toBe("एक रुपैयाँ")
      expect(toNepaliCurrencyWords(5)).toBe("पाँच रुपैयाँ")
      expect(toNepaliCurrencyWords(100)).toBe("एक सय रुपैयाँ")
    })

    test("handles paisa correctly", () => {
      expect(toNepaliCurrencyWords(0.50)).toBe("पचास पैसा")
      expect(toNepaliCurrencyWords(0.25)).toBe("पच्चीस पैसा")
      expect(toNepaliCurrencyWords(0.01)).toBe("एक पैसा")
    })

    test("handles rupees and paisa together", () => {
      expect(toNepaliCurrencyWords(1.50)).toBe("एक रुपैयाँ पचास पैसा")
      expect(toNepaliCurrencyWords(125.75)).toBe("एक सय पच्चीस रुपैयाँ पचहत्तर पैसा")
      expect(toNepaliCurrencyWords(5.05)).toBe("पाँच रुपैयाँ पाँच पैसा")
    })

    test("handles zero amount", () => {
      expect(toNepaliCurrencyWords(0)).toBe("शून्य रुपैयाँ")
      expect(toNepaliCurrencyWords(0.00)).toBe("शून्य रुपैयाँ")
    })

    test("handles large amounts", () => {
      expect(toNepaliCurrencyWords(1000)).toBe("एक हजार रुपैयाँ")
      expect(toNepaliCurrencyWords(100000)).toBe("एक लाख रुपैयाँ")
      expect(toNepaliCurrencyWords(10000000)).toBe("एक करोड रुपैयाँ")
    })

    test("handles decimal precision edge cases", () => {
      expect(toNepaliCurrencyWords(1.999)).toBe("दुई रुपैयाँ")
      expect(toNepaliCurrencyWords(1.001)).toBe("एक रुपैयाँ")
      expect(toNepaliCurrencyWords(1.995)).toBe("दुई रुपैयाँ")
    })

    test("handles negative amounts", () => {
      expect(toNepaliCurrencyWords(-100)).toBe("ऋण एक सय रुपैयाँ")
      expect(toNepaliCurrencyWords(-1.50)).toBe("ऋण एक रुपैयाँ पचास पैसा")
    })

    test("handles fractional paisa correctly", () => {
      expect(toNepaliCurrencyWords(1.234)).toBe("एक रुपैयाँ तेईस पैसा")
      expect(toNepaliCurrencyWords(1.678)).toBe("एक रुपैयाँ अठसट्ठी पैसा")
    })
  })
  describe("ADR-0015: toNepaliCurrency", () => {
    test("reads grouped strings, bigint and rounds exactly", () => {
      expect(toNepaliCurrency("1,234")).toBe("रू १,२३४.००")
      expect(toNepaliCurrency("१२३४.५")).toBe("रू १,२३४.५०")
      expect(toNepaliCurrency(1.005)).toBe("रू १.०१")
      expect(toNepaliCurrency(12345678901234567890n)).toBe("रू १,२३,४५,६७,८९,०१,२३,४५,६७,८९०.००")
      expect(toNepaliCurrency(1234567.89, { showPaisa: false })).toBe("रू १२,३४,५६८")
      expect(toNepaliCurrency(1234.567, { precision: 3 })).toBe("रू १,२३४.५६७")
    })

    test("puts the minus sign in front of the whole string", () => {
      expect(toNepaliCurrency(-50)).toBe("-रू ५०.००")
      expect(toNepaliCurrency(-1234.5)).toBe("-रू १,२३४.५०")
      expect(toNepaliCurrency(-1234.5, { symbolPosition: "after" })).toBe("-१,२३४.५० रू")
      expect(toNepaliCurrency(-0.001)).toBe("रू ०.००")
    })

    test("places the symbol and groups as asked", () => {
      expect(toNepaliCurrency(1234, { symbolPosition: "after" })).toBe("१,२३४.०० रू")
      expect(toNepaliCurrency(1234567.89, { grouping: "international" })).toBe("रू १,२३४,५६७.८९")
      expect(toNepaliCurrency(1234, { useNepaliDigits: false, currencySymbol: "Rs." })).toBe("Rs. 1,234.00")
      expect(toNepaliCurrency(1234567, { addCommas: false } as object)).toBe("रू १२३४५६७.००")
    })

    test("returns an empty string for input that is not a number", () => {
      expect(toNepaliCurrency("abc")).toBe("")
      expect(toNepaliCurrency("")).toBe("")
      expect(toNepaliCurrency(NaN)).toBe("")
      expect(toNepaliCurrency(null as unknown as string)).toBe("")
    })
  })

  describe("ADR-0015: toNepaliCurrencyWords", () => {
    test("rounds paisa half away from zero and carries into rupees", () => {
      expect(toNepaliCurrencyWords(1.005)).toBe("एक रुपैयाँ एक पैसा")
      expect(toNepaliCurrencyWords(100.999)).toBe("एक सय एक रुपैयाँ")
      expect(toNepaliCurrencyWords(0.994)).toBe("उनान्सय पैसा")
      expect(toNepaliCurrencyWords(0.5)).toBe("पचास पैसा")
      expect(toNepaliCurrencyWords(0.05)).toBe("पाँच पैसा")
      expect(toNepaliCurrencyWords(0.001)).toBe("शून्य रुपैयाँ")
      expect(toNepaliCurrencyWords(-0.001)).toBe("शून्य रुपैयाँ")
      expect(toNepaliCurrencyWords("१,२५०.५०")).toBe("एक हजार दुई सय पचास रुपैयाँ पचास पैसा")
      expect(toNepaliCurrencyWords(-0.5)).toBe("ऋण पचास पैसा")
    })

    test("is exact for bigint", () => {
      expect(toNepaliCurrencyWords(10n ** 19n)).toBe("एक महाशंख रुपैयाँ")
    })

    test("appends the cheque closing word on request", () => {
      expect(toNepaliCurrencyWords(250, { only: true })).toBe("दुई सय पचास रुपैयाँ मात्र")
      expect(toNepaliCurrencyWords(12.5, { only: true })).toBe("बाह्र रुपैयाँ पचास पैसा मात्र")
      expect(toNepaliCurrencyWords(0, { only: true })).toBe("शून्य रुपैयाँ मात्र")
    })

    test("returns an empty string for input that is not a number", () => {
      expect(toNepaliCurrencyWords("abc")).toBe("")
      expect(toNepaliCurrencyWords("")).toBe("")
      expect(toNepaliCurrencyWords("abc", { only: true })).toBe("")
    })
  })

  describe("toEnglishCurrencyWords", () => {
    test("writes rupees and paisa", () => {
      expect(toEnglishCurrencyWords(250)).toBe("two hundred fifty rupees")
      expect(toEnglishCurrencyWords(1)).toBe("one rupee")
      expect(toEnglishCurrencyWords(12.5)).toBe("twelve rupees fifty paisa")
      expect(toEnglishCurrencyWords("१,२५०.५०")).toBe("one thousand two hundred fifty rupees fifty paisa")
      expect(toEnglishCurrencyWords(12345678)).toBe(
        "one crore twenty three lakh forty five thousand six hundred seventy eight rupees",
      )
      expect(toEnglishCurrencyWords(0.5)).toBe("fifty paisa")
      expect(toEnglishCurrencyWords(1.005)).toBe("one rupee one paisa")
      expect(toEnglishCurrencyWords(-5)).toBe("negative five rupees")
      expect(toEnglishCurrencyWords(0)).toBe("zero rupees")
    })

    test("takes only and the word options", () => {
      expect(toEnglishCurrencyWords(250, { only: true })).toBe("two hundred fifty rupees only")
      expect(toEnglishCurrencyWords(1234567, { system: "international" })).toBe(
        "one million two hundred thirty four thousand five hundred sixty seven rupees",
      )
      expect(toEnglishCurrencyWords(121.21, { hyphenate: true, and: true })).toBe(
        "one hundred and twenty-one rupees twenty-one paisa",
      )
    })

    test("returns an empty string for input that is not a number", () => {
      expect(toEnglishCurrencyWords("abc")).toBe("")
      expect(toEnglishCurrencyWords(Infinity)).toBe("")
    })
  })

  describe("parseNepaliCurrency", () => {
    test("reads amounts with a recognised symbol", () => {
      expect(parseNepaliCurrency("रू १२,३४,५६७.८९")).toBe(1234567.89)
      expect(parseNepaliCurrency("रु. ५००")).toBe(500)
      expect(parseNepaliCurrency("रु ५००")).toBe(500)
      expect(parseNepaliCurrency("Rs. 1,234/-")).toBe(1234)
      expect(parseNepaliCurrency("Rs 1,234")).toBe(1234)
      expect(parseNepaliCurrency("rs.500")).toBe(500)
      expect(parseNepaliCurrency("NPR 500")).toBe(500)
      expect(parseNepaliCurrency("500 npr")).toBe(500)
      expect(parseNepaliCurrency("१,२३४.०० रू")).toBe(1234)
      expect(parseNepaliCurrency("500")).toBe(500)
      expect(parseNepaliCurrency("रू ०.००")).toBe(0)
      expect(parseNepaliCurrency("  रू ५००  ")).toBe(500)
    })

    test("reads the sign before the symbol or before the number", () => {
      expect(parseNepaliCurrency("-रू ५००")).toBe(-500)
      expect(parseNepaliCurrency("रू -५००")).toBe(-500)
      expect(parseNepaliCurrency("-500/-")).toBe(-500)
      expect(parseNepaliCurrency("-रू ०")).toBe(0)
      expect(parseNepaliCurrency("-रू -५००")).toBeNaN()
    })

    test("round-trips toNepaliCurrency", () => {
      for (const value of [0, 1, 1234.5, -1234.5, 12345678.9]) {
        expect(parseNepaliCurrency(toNepaliCurrency(value))).toBe(value)
        expect(parseNepaliCurrency(toNepaliCurrency(value, { symbolPosition: "after" }))).toBe(value)
      }
    })

    test("returns NaN for anything else", () => {
      for (const invalid of ["$5", "abc", "", "रू", "Rs.", "/-", "रू रू ५", "५ रुपैयाँ", "USD 5", "रू 5x", "₹५"]) {
        expect(parseNepaliCurrency(invalid)).toBeNaN()
      }
      expect(parseNepaliCurrency(null as unknown as string)).toBeNaN()
    })
  })
})
