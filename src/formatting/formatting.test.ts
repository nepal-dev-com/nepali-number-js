import { describe, expect, test } from "bun:test"
import { addNepaliCommas, formatNepaliNumber, formatPercent, removeFormatting } from "."

describe("Formatting Functions", () => {
  describe("addNepaliCommas", () => {
    test("adds commas for thousands", () => {
      expect(addNepaliCommas("1234")).toBe("1,234")
      expect(addNepaliCommas("12345")).toBe("12,345")
    })

    test("uses Indian numbering system", () => {
      expect(addNepaliCommas("1234567")).toBe("12,34,567")
      expect(addNepaliCommas("12345678")).toBe("1,23,45,678")
      expect(addNepaliCommas("123456789")).toBe("12,34,56,789")
    })

    test("handles decimal numbers", () => {
      expect(addNepaliCommas("1234.56")).toBe("1,234.56")
      expect(addNepaliCommas("1234567.89")).toBe("12,34,567.89")
    })

    test("handles small numbers", () => {
      expect(addNepaliCommas("123")).toBe("123")
      expect(addNepaliCommas("12")).toBe("12")
      expect(addNepaliCommas("1")).toBe("1")
    })

    test("handles edge cases", () => {
      expect(addNepaliCommas("")).toBe("")
      expect(addNepaliCommas("0")).toBe("0")
      expect(addNepaliCommas("100")).toBe("100")
      expect(addNepaliCommas("1000")).toBe("1,000")
    })

    test("handles very long numbers", () => {
      const longNumber = "123456789012345"
      expect(addNepaliCommas(longNumber)).toBe("12,34,56,78,90,12,345")
    })

    test("preserves decimal precision", () => {
      expect(addNepaliCommas("1234567.123456789")).toBe("12,34,567.123456789")
      expect(addNepaliCommas("123.000")).toBe("123.000")
    })

    test("handles negative numbers", () => {
      expect(formatNepaliNumber(-123.45)).toBe("-१२३.४५")
      expect(formatNepaliNumber(-1234567.89)).toBe("-१२,३४,५६७.८९")
    })
  })

  describe("formatNepaliNumber", () => {
    test("formats basic numbers", () => {
      expect(formatNepaliNumber(123)).toBe("१२३")
      expect(formatNepaliNumber(1234.56)).toBe("१,२३४.५६")
      expect(formatNepaliNumber(0)).toBe("०")
    })

    test("respects useNepaliDigits option", () => {
      expect(formatNepaliNumber(123, { useNepaliDigits: false })).toBe("123")
      expect(formatNepaliNumber(1234.56, { useNepaliDigits: false })).toBe("1,234.56")
    })

    test("respects addCommas option", () => {
      expect(formatNepaliNumber(1234, { addCommas: false })).toBe("१२३४")
      expect(formatNepaliNumber(1234567, { addCommas: false })).toBe("१२३४५६७")
    })

    test("handles precision option", () => {
      expect(formatNepaliNumber(123.456, { precision: 2 })).toBe("१२३.४६")
      expect(formatNepaliNumber(123.456, { precision: 0 })).toBe("१२३")
      expect(formatNepaliNumber(123.456, { precision: 4 })).toBe("१२३.४५६०")
    })

    test("handles trimZero option", () => {
      expect(formatNepaliNumber(0, { trimZero: false })).toBe("०.००")
      expect(formatNepaliNumber(0, { trimZero: true })).toBe("०")
    })

    test("handles string input", () => {
      expect(formatNepaliNumber("123")).toBe("१२३")
      expect(formatNepaliNumber("१२३४.५६")).toBe("१,२३४.५६")
    })

    test("handles invalid input", () => {
      expect(formatNepaliNumber("abc")).toBe("")
      expect(formatNepaliNumber("abc", { trimZero: true })).toBe("")
      expect(formatNepaliNumber("")).toBe("")
      expect(formatNepaliNumber("12abc")).toBe("")
      expect(formatNepaliNumber(NaN)).toBe("")
      expect(formatNepaliNumber(Infinity)).toBe("")
      expect(formatNepaliNumber(null as unknown as string)).toBe("")
      expect(formatNepaliNumber(undefined as unknown as string)).toBe("")
    })

    test("removes trailing zeros", () => {
      expect(formatNepaliNumber(123.00)).toBe("१२३")
      expect(formatNepaliNumber(123.100)).toBe("१२३.१०")
      expect(formatNepaliNumber(123.50, { precision: 1 })).toBe("१२३.५")
    })

    test("handles negative numbers", () => {
      expect(formatNepaliNumber(-123.45)).toBe("-१२३.४५")
      expect(formatNepaliNumber(-1234567.89)).toBe("-१२,३४,५६७.८९")
    })

    test("handles very large numbers", () => {
      expect(formatNepaliNumber(1234567890123)).toBe("१२,३४,५६,७८,९०,१२३")
    })

    test("handles very small numbers", () => {
      expect(formatNepaliNumber(0.0001)).toBe("०")
      expect(formatNepaliNumber(0.0001, { precision: 4 })).toBe("०.०००१")
    })
  })

  describe("removeFormatting", () => {
    test("removes commas and spaces", () => {
      expect(removeFormatting("१,२३४")).toBe(1234)
      expect(removeFormatting("१२ ३४ ५६७")).toBe(1234567)
    })

    test("converts Nepali digits", () => {
      expect(removeFormatting("१२३.४५")).toBe(123.45)
      expect(removeFormatting("९,८७,६५४.३२१")).toBe(987654.321)
    })

    test("removes currency symbols", () => {
      expect(removeFormatting("रु १,२३४.५६")).toBe(1234.56)
      expect(removeFormatting("$ १२३")).toBe(123)
    })

    test("handles mixed formatting", () => {
      expect(removeFormatting("Price: रु १,२३,४५६.७८")).toBe(123456.78)
    })

    test("preserves negative sign", () => {
      expect(removeFormatting("-१,२३४.५६")).toBe(-1234.56)
    })

    test("handles empty and invalid input", () => {
      expect(removeFormatting("")).toBeNaN()
      expect(removeFormatting("abc")).toBeNaN()
      expect(removeFormatting("   ")).toBeNaN()
      expect(removeFormatting("1.2.3")).toBeNaN()
      expect(removeFormatting(null as unknown as string)).toBeNaN()
      expect(removeFormatting("50%")).toBe(50)
      expect(removeFormatting("12abc34")).toBe(1234)
    })

    test("handles already clean numbers", () => {
      expect(removeFormatting(123.45)).toBe(123.45)
      expect(removeFormatting("-67.89")).toBe(-67.89)
    })
  })
  describe("exact reading (ADR-0012, ADR-0013)", () => {
    test("reads grouped strings and rounds half away from zero", () => {
      expect(formatNepaliNumber("1,234")).toBe("१,२३४")
      expect(formatNepaliNumber(1.005)).toBe("१.०१")
      expect(formatNepaliNumber(-1.005)).toBe("-१.०१")
      expect(formatNepaliNumber(1234.567)).toBe("१,२३४.५७")
      expect(formatNepaliNumber(-0.001)).toBe("०")
      expect(formatNepaliNumber(2.5, { precision: 0 })).toBe("३")
      expect(formatNepaliNumber(1234.5, { precision: 0 })).toBe("१,२३५")
      expect(formatNepaliNumber(9.999)).toBe("१०")
      expect(formatNepaliNumber(0.995)).toBe("१")
    })

    test("is exact for bigint, long strings and exponent-form numbers", () => {
      expect(formatNepaliNumber(12345678901234567890n)).toBe("१,२३,४५,६७,८९,०१,२३,४५,६७,८९०")
      expect(formatNepaliNumber("12345678901234567890")).toBe("१,२३,४५,६७,८९,०१,२३,४५,६७,८९०")
      expect(formatNepaliNumber(1e21)).toBe("१,००,००,००,००,००,००,००,००,००,०००")
      expect(formatNepaliNumber(-5n)).toBe("-५")
    })

    test("reads an out-of-range precision as 2 instead of throwing", () => {
      expect(formatNepaliNumber(1.5, { precision: 101 })).toBe("१.५०")
      expect(formatNepaliNumber(1.5, { precision: 1.5 })).toBe("१.५०")
      expect(formatNepaliNumber(1.5, { precision: -1 })).toBe("१.५०")
      expect(formatNepaliNumber(1.5, { precision: NaN })).toBe("१.५०")
      expect(formatNepaliNumber(1234, { precision: 3, trimZero: false })).toBe("१,२३४.०००")
    })

    test("groups internationally and shows a plus sign on request", () => {
      expect(formatNepaliNumber(1234567, { grouping: "international" })).toBe("१,२३४,५६७")
      expect(formatNepaliNumber(1234, { sign: "always" })).toBe("+१,२३४")
      expect(formatNepaliNumber(-1234, { sign: "always" })).toBe("-१,२३४")
      expect(formatNepaliNumber(0, { sign: "always" })).toBe("०")
      expect(formatNepaliNumber(0, { trimZero: false })).toBe("०.००")
    })
  })

  describe("addNepaliCommas (ADR-0013)", () => {
    test("keeps the script of the digits as written", () => {
      expect(addNepaliCommas("१२३४५६७")).toBe("१२,३४,५६७")
      expect(addNepaliCommas("12३4567")).toBe("12,३4,567")
      expect(addNepaliCommas("-१२३४५६७.८९१")).toBe("-१२,३४,५६७.८९१")
    })

    test("regroups, strips leading zeros and accepts bigint", () => {
      expect(addNepaliCommas("1,234,567")).toBe("12,34,567")
      expect(addNepaliCommas("0001234")).toBe("1,234")
      expect(addNepaliCommas(".5")).toBe("0.5")
      expect(addNepaliCommas("5.")).toBe("5")
      expect(addNepaliCommas(1234567n)).toBe("12,34,567")
      expect(addNepaliCommas(1234567, "international")).toBe("1,234,567")
      expect(addNepaliCommas(1234.5)).toBe("1,234.5")
      expect(addNepaliCommas(0)).toBe("0")
    })

    test("returns an empty string for input that is not a number", () => {
      expect(addNepaliCommas("abc")).toBe("")
      expect(addNepaliCommas("")).toBe("")
      expect(addNepaliCommas(NaN)).toBe("")
      expect(addNepaliCommas(null as unknown as string)).toBe("")
    })

    test("groups a 100 000-digit string in linear time", () => {
      const started = performance.now()
      const grouped = addNepaliCommas("9".repeat(100000))
      expect(grouped.length).toBe(100000 + 49999)
      expect(addNepaliCommas("9".repeat(100000) + "x")).toBe("")
      expect(performance.now() - started).toBeLessThan(1000)
    })
  })

  describe("formatPercent", () => {
    test("formats percentages", () => {
      expect(formatPercent(12.5)).toBe("१२.५०%")
      expect(formatPercent(50)).toBe("५०%")
      expect(formatPercent("१२.५")).toBe("१२.५०%")
      expect(formatPercent(0)).toBe("०%")
      expect(formatPercent(-3)).toBe("-३%")
      expect(formatPercent(1234.5)).toBe("१,२३४.५०%")
    })

    test("reads a ratio by moving the decimal point exactly", () => {
      expect(formatPercent(0.125, { isRatio: true })).toBe("१२.५०%")
      expect(formatPercent(1, { isRatio: true })).toBe("१००%")
      expect(formatPercent(0.07, { isRatio: true })).toBe("७%")
      expect(formatPercent("0.0005", { isRatio: true, precision: 3 })).toBe("०.०५०%")
    })

    test("respects its options", () => {
      expect(formatPercent(12.5, { useNepaliDigits: false })).toBe("12.50%")
      expect(formatPercent(12.5, { symbol: " प्रतिशत" })).toBe("१२.५० प्रतिशत")
      expect(formatPercent(12.5, { precision: 0 })).toBe("१३%")
      expect(formatPercent(50, { trimZero: false })).toBe("५०.००%")
      expect(formatPercent(1234, { addCommas: false })).toBe("१२३४%")
    })

    test("returns an empty string for input that is not a number", () => {
      expect(formatPercent("abc")).toBe("")
      expect(formatPercent("")).toBe("")
    })
  })
})
