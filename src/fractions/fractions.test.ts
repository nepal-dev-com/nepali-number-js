import { describe, expect, test } from "bun:test"
import { toNepaliFraction, toNepaliFractionWords, toNepaliMultiplier } from "."

describe("Fraction Functions", () => {
  describe("toNepaliFraction", () => {
    test("writes the spoken form of quarter steps", () => {
      const cases: [number | string, string][] = [
        [0.25, "पाउ"], [0.5, "आधा"], [0.75, "तीन पाउ"], [1.25, "सवा"], [1.5, "डेढ"], [1.75, "पौने दुई"],
        [2.25, "सवा दुई"], [2.5, "अढाई"], [2.75, "पौने तीन"], [3.5, "साढे तीन"], [3.25, "सवा तीन"],
        [9.75, "पौने दश"], [99.75, "पौने एक सय"], [100.5, "साढे एक सय"], [10000000.5, "साढे एक करोड"],
      ]
      for (const [input, expected] of cases) {
        expect(toNepaliFraction(input)).toBe(expected)
      }
    })

    test("accepts Nepali digits, strings with trailing zeros and bigint", () => {
      expect(toNepaliFraction("३.५")).toBe("साढे तीन")
      expect(toNepaliFraction("1.50")).toBe("डेढ")
      expect(toNepaliFraction("2.250")).toBe("सवा दुई")
      expect(toNepaliFraction("1,000.5")).toBe("साढे एक हजार")
      expect(toNepaliFraction(5n)).toBe("पाँच")
      expect(toNepaliFraction("99999999999999999999.75")).toBe("पौने दश महाशंख")
      expect(toNepaliFraction("12345678901234567890.5")).toBe(
        "साढे एक महाशंख तेईस शंख पैंतालीस पद्म सतसट्ठी नील उनान्नब्बे खर्ब एक अर्ब तेईस करोड पैंतालीस लाख सतसट्ठी हजार आठ सय नब्बे",
      )
    })

    test("falls back to plain words for integers and other values", () => {
      expect(toNepaliFraction(5)).toBe("पाँच")
      expect(toNepaliFraction("5.0")).toBe("पाँच")
      expect(toNepaliFraction(0)).toBe("शून्य")
      expect(toNepaliFraction(12345678)).toBe("एक करोड तेईस लाख पैंतालीस हजार छ सय अठहत्तर")
      expect(toNepaliFraction(1.3)).toBe("एक दशमलव तीन")
      expect(toNepaliFraction(0.125)).toBe("शून्य दशमलव एक दुई पाँच")
      expect(toNepaliFraction(2.05)).toBe("दुई दशमलव शून्य पाँच")
    })

    test("prefixes negatives with ऋण", () => {
      expect(toNepaliFraction(-1.5)).toBe("ऋण डेढ")
      expect(toNepaliFraction(-0.25)).toBe("ऋण पाउ")
      expect(toNepaliFraction(-3.75)).toBe("ऋण पौने चार")
      expect(toNepaliFraction(-5)).toBe("ऋण पाँच")
      expect(toNepaliFraction(-1.3)).toBe("ऋण एक दशमलव तीन")
      expect(toNepaliFraction(-0)).toBe("शून्य")
    })

    test("returns an empty string for input that is not a number", () => {
      for (const invalid of ["abc", "", "1.2.3", "12abc", "1/2"]) {
        expect(toNepaliFraction(invalid)).toBe("")
      }
      expect(toNepaliFraction(NaN)).toBe("")
      expect(toNepaliFraction(Infinity)).toBe("")
      expect(toNepaliFraction(null as unknown as string)).toBe("")
      expect(toNepaliFraction(undefined as unknown as string)).toBe("")
    })
  })

  describe("toNepaliFractionWords", () => {
    test("reads numerator, बटा, denominator", () => {
      expect(toNepaliFractionWords(2, 5)).toBe("दुई बटा पाँच")
      expect(toNepaliFractionWords(1, 2)).toBe("एक बटा दुई")
      expect(toNepaliFractionWords(3, 4)).toBe("तीन बटा चार")
      expect(toNepaliFractionWords("२", "५")).toBe("दुई बटा पाँच")
      expect(toNepaliFractionWords(7, 3)).toBe("सात बटा तीन")
      expect(toNepaliFractionWords(0, 5)).toBe("शून्य बटा पाँच")
      expect(toNepaliFractionWords(-2, 5)).toBe("ऋण दुई बटा पाँच")
      expect(toNepaliFractionWords(1, 10000000)).toBe("एक बटा एक करोड")
      expect(toNepaliFractionWords(2n, 5n)).toBe("दुई बटा पाँच")
      expect(toNepaliFractionWords("2.0", "5.00")).toBe("दुई बटा पाँच")
      expect(toNepaliFractionWords(4, 8)).toBe("चार बटा आठ")
    })

    test("returns an empty string for a non-integer or a denominator that is not positive", () => {
      expect(toNepaliFractionWords(1.5, 2)).toBe("")
      expect(toNepaliFractionWords(1, 2.5)).toBe("")
      expect(toNepaliFractionWords(2, 0)).toBe("")
      expect(toNepaliFractionWords(2, -5)).toBe("")
    })

    test("returns an empty string for input that is not a number", () => {
      expect(toNepaliFractionWords("abc", 5)).toBe("")
      expect(toNepaliFractionWords(5, "abc")).toBe("")
      expect(toNepaliFractionWords("", "")).toBe("")
      expect(toNepaliFractionWords(NaN, 2)).toBe("")
      expect(toNepaliFractionWords(null as unknown as string, 2)).toBe("")
      expect(toNepaliFractionWords(2, undefined as unknown as string)).toBe("")
    })
  })

  describe("toNepaliMultiplier", () => {
    test("uses its own word for 2, 3 and 4", () => {
      expect(toNepaliMultiplier(2)).toBe("दोब्बर")
      expect(toNepaliMultiplier(3)).toBe("तेब्बर")
      expect(toNepaliMultiplier(4)).toBe("चौबर")
      expect(toNepaliMultiplier("२")).toBe("दोब्बर")
      expect(toNepaliMultiplier("2.0")).toBe("दोब्बर")
      expect(toNepaliMultiplier(3n)).toBe("तेब्बर")
    })

    test("writes every other positive value with गुणा", () => {
      expect(toNepaliMultiplier(5)).toBe("पाँच गुणा")
      expect(toNepaliMultiplier("१०")).toBe("दश गुणा")
      expect(toNepaliMultiplier(1)).toBe("एक गुणा")
      expect(toNepaliMultiplier(100)).toBe("एक सय गुणा")
      expect(toNepaliMultiplier(10000000)).toBe("एक करोड गुणा")
      expect(toNepaliMultiplier(2.5)).toBe("दुई दशमलव पाँच गुणा")
      expect(toNepaliMultiplier(0.5)).toBe("शून्य दशमलव पाँच गुणा")
      expect(toNepaliMultiplier(22)).toBe("बाईस गुणा")
    })

    test("returns an empty string for zero, negatives and input that is not a number", () => {
      expect(toNepaliMultiplier(0)).toBe("")
      expect(toNepaliMultiplier("0.0")).toBe("")
      expect(toNepaliMultiplier(-2)).toBe("")
      expect(toNepaliMultiplier("abc")).toBe("")
      expect(toNepaliMultiplier("")).toBe("")
      expect(toNepaliMultiplier(NaN)).toBe("")
      expect(toNepaliMultiplier(null as unknown as string)).toBe("")
    })
  })
})
