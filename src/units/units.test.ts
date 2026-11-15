import { describe, expect, test } from "bun:test"
import {
  convertLandArea,
  convertWeight,
  formatBigha,
  formatRopani,
  formatTola,
  type LandUnit,
  parseLandArea,
  type WeightUnit,
} from "."

describe("Unit Functions", () => {
  describe("convertLandArea", () => {
    test("converts within the hill system", () => {
      expect(convertLandArea(1, "ropani", "sqft")).toBe(5476)
      expect(convertLandArea(1, "ropani", "aana")).toBe(16)
      expect(convertLandArea(1, "ropani", "paisa")).toBe(64)
      expect(convertLandArea(1, "ropani", "dam")).toBe(256)
      expect(convertLandArea(5, "aana", "sqft")).toBe(1711.25)
    })

    test("converts within the Terai system", () => {
      expect(convertLandArea(1, "bigha", "kattha")).toBe(20)
      expect(convertLandArea(1, "bigha", "dhur")).toBe(400)
      expect(convertLandArea(1, "bigha", "sqft")).toBe(72900)
      expect(convertLandArea(1.5, "bigha", "sqft")).toBe(109350)
    })

    test("converts across systems and to metric", () => {
      expect(convertLandArea(1, "ropani", "sqm")).toBeCloseTo(508.73704704, 8)
      expect(convertLandArea(1, "bigha", "ropani")).toBeCloseTo(13.31263696128561, 12)
      expect(convertLandArea(10000000, "sqft", "bigha")).toBeCloseTo(137.17421124828533, 10)
      expect(convertLandArea(1, "sqm", "sqm")).toBe(1)
    })

    test("handles zero and negative values", () => {
      expect(convertLandArea(0, "ropani", "sqft")).toBe(0)
      expect(convertLandArea(-1, "ropani", "sqft")).toBe(-5476)
    })

    test("returns NaN for an unknown unit or a non-finite value", () => {
      expect(convertLandArea(NaN, "ropani", "sqft")).toBeNaN()
      expect(convertLandArea(Infinity, "ropani", "sqft")).toBeNaN()
      expect(convertLandArea(1, "acre" as LandUnit, "sqft")).toBeNaN()
      expect(convertLandArea(1, "ropani", "toString" as LandUnit)).toBeNaN()
      expect(convertLandArea(1, "tola" as LandUnit, "sqft")).toBeNaN()
      expect(convertLandArea("1" as unknown as number, "ropani", "sqft")).toBeNaN()
      expect(convertLandArea(null as unknown as number, "ropani", "sqft")).toBeNaN()
      expect(convertLandArea(1, null as unknown as LandUnit, "sqft")).toBeNaN()
    })
  })

  describe("convertWeight", () => {
    test("converts between tola, lal, gram and kilogram", () => {
      expect(convertWeight(1, "tola", "gram")).toBe(11.6638)
      expect(convertWeight(1, "tola", "lal")).toBeCloseTo(100, 10)
      expect(convertWeight(2.5, "tola", "gram")).toBeCloseTo(29.1595, 10)
      expect(convertWeight(1, "kilogram", "gram")).toBe(1000)
      expect(convertWeight(1, "kilogram", "tola")).toBeCloseTo(85.73535211509113, 10)
    })

    test("handles zero and negative values", () => {
      expect(convertWeight(0, "tola", "gram")).toBe(0)
      expect(convertWeight(-1, "tola", "gram")).toBe(-11.6638)
    })

    test("returns NaN for an unknown unit or a non-finite value", () => {
      expect(convertWeight(NaN, "tola", "gram")).toBeNaN()
      expect(convertWeight(-Infinity, "tola", "gram")).toBeNaN()
      expect(convertWeight(1, "pound" as WeightUnit, "gram")).toBeNaN()
      expect(convertWeight(1, "tola", "ropani" as WeightUnit)).toBeNaN()
      expect(convertWeight(null as unknown as number, "tola", "gram")).toBeNaN()
    })
  })

  describe("formatRopani", () => {
    test("writes the four parts in notation", () => {
      expect(formatRopani(5476)).toBe("१-०-०-०")
      expect(formatRopani(6438.578125)).toBe("१-२-३-१")
      expect(formatRopani(6000)).toBe("१-१-२-०.५")
      expect(formatRopani(12345)).toBe("२-४-०-१.१२")
      expect(formatRopani(0)).toBe("०-०-०-०")
      expect(formatRopani(54760000)).toBe("१००००-०-०-०")
    })

    test("reads the value in another unit", () => {
      expect(formatRopani(1, { from: "ropani" })).toBe("१-०-०-०")
      expect(formatRopani(1, { from: "bigha" })).toBe("१३-५-०-०.०४")
      expect(formatRopani(20, { from: "aana" })).toBe("१-४-०-०")
    })

    test("writes words and omits zero parts", () => {
      expect(formatRopani(6438.578125, { style: "words" })).toBe("१ रोपनी २ आना ३ पैसा १ दाम")
      expect(formatRopani(6000, { style: "words" })).toBe("१ रोपनी १ आना २ पैसा ०.५ दाम")
      expect(formatRopani(5476, { style: "words" })).toBe("१ रोपनी")
      expect(formatRopani(0, { style: "words" })).toBe("० रोपनी")
    })

    test("keeps English digits on request", () => {
      expect(formatRopani(6438.578125, { useNepaliDigits: false })).toBe("1-2-3-1")
      expect(formatRopani(5476, { style: "words", useNepaliDigits: false })).toBe("1 रोपनी")
    })

    test("carries upward when rounding lifts dam to a full paisa", () => {
      expect(formatRopani(21.390625 * 3.999)).toBe("०-०-१-०")
      expect(formatRopani(21.390625 * 255.999)).toBe("१-०-०-०")
      expect(formatRopani(21.390625 * 3.994)).toBe("०-०-०-३.९९")
    })

    test("returns an empty string for negative, non-finite or wrong-unit input", () => {
      expect(formatRopani(-5476)).toBe("")
      expect(formatRopani(NaN)).toBe("")
      expect(formatRopani(Infinity)).toBe("")
      expect(formatRopani(1, { from: "gram" })).toBe("")
      expect(formatRopani(1, { from: "acre" as LandUnit })).toBe("")
      expect(formatRopani(null as unknown as number)).toBe("")
      expect(formatRopani("5476" as unknown as number)).toBe("")
      expect(formatRopani(5476, null as unknown as undefined)).toBe("१-०-०-०")
    })
  })

  describe("formatBigha", () => {
    test("writes the three parts in notation", () => {
      expect(formatBigha(72900)).toBe("१-०-०")
      expect(formatBigha(1.5, { from: "bigha" })).toBe("१-१०-०")
      expect(formatBigha(10000)).toBe("०-२-१४.८७")
      expect(formatBigha(0)).toBe("०-०-०")
      expect(formatBigha(729000000)).toBe("१००००-०-०")
    })

    test("writes words and English digits", () => {
      expect(formatBigha(1.5, { from: "bigha", style: "words" })).toBe("१ बिघा १० कट्ठा")
      expect(formatBigha(72900, { style: "words" })).toBe("१ बिघा")
      expect(formatBigha(0, { style: "words" })).toBe("० बिघा")
      expect(formatBigha(1.5, { from: "bigha", useNepaliDigits: false })).toBe("1-10-0")
    })

    test("carries upward when rounding lifts dhur to a full kattha", () => {
      expect(formatBigha(182.25 * 399.999)).toBe("१-०-०")
      expect(formatBigha(182.25 * 19.996)).toBe("०-१-०")
    })

    test("returns an empty string for negative, non-finite or wrong-unit input", () => {
      expect(formatBigha(-72900)).toBe("")
      expect(formatBigha(NaN)).toBe("")
      expect(formatBigha(1, { from: "tola" })).toBe("")
    })
  })

  describe("formatTola", () => {
    test("writes tola and lal", () => {
      expect(formatTola(29.1595)).toBe("२-५०")
      expect(formatTola(50)).toBe("४-२८.६८")
      expect(formatTola(1, { from: "tola" })).toBe("१-०")
      expect(formatTola(1, { from: "kilogram" })).toBe("८५-७३.५४")
      expect(formatTola(0)).toBe("०-०")
    })

    test("writes words and English digits", () => {
      expect(formatTola(29.1595, { style: "words" })).toBe("२ तोला ५० लाल")
      expect(formatTola(1, { from: "tola", style: "words" })).toBe("१ तोला")
      expect(formatTola(0, { style: "words" })).toBe("० तोला")
      expect(formatTola(29.1595, { useNepaliDigits: false })).toBe("2-50")
    })

    test("carries upward when rounding lifts lal to a full tola", () => {
      expect(formatTola(0.99999, { from: "tola" })).toBe("१-०")
      expect(formatTola(99.994, { from: "lal" })).toBe("०-९९.९९")
    })

    test("returns an empty string for negative, non-finite or wrong-unit input", () => {
      expect(formatTola(-5)).toBe("")
      expect(formatTola(NaN)).toBe("")
      expect(formatTola(1, { from: "ropani" })).toBe("")
    })
  })

  describe("parseLandArea", () => {
    test("reads a record in either script", () => {
      expect(parseLandArea("१-२-३-१", "ropani")).toBe(6438.578125)
      expect(parseLandArea("1-2-3-1", "ropani")).toBe(6438.578125)
      expect(parseLandArea("1-10-0", "bigha")).toBe(109350)
      expect(parseLandArea("१-१-२-०.५", "ropani")).toBe(6000.0703125)
      expect(parseLandArea(" 1 - 2 - 3 - 1 ", "ropani")).toBe(6438.578125)
      expect(parseLandArea("0-0-0-0", "ropani")).toBe(0)
    })

    test("accepts a part above its base", () => {
      expect(parseLandArea("0-20-0-0", "ropani")).toBe(6845)
    })

    test("round-trips what the formatters write when nothing was rounded", () => {
      expect(parseLandArea(formatRopani(6438.578125), "ropani")).toBe(6438.578125)
      expect(parseLandArea(formatBigha(109350), "bigha")).toBe(109350)
      expect(formatRopani(parseLandArea("१-२-३-१", "ropani"))).toBe("१-२-३-१")
    })

    test("returns NaN for a wrong part count, a sign or a non-number", () => {
      expect(parseLandArea("1-2-3", "ropani")).toBeNaN()
      expect(parseLandArea("1-2-3-1", "bigha")).toBeNaN()
      expect(parseLandArea("-1-2-3-1", "ropani")).toBeNaN()
      expect(parseLandArea("+1-2-3-1", "ropani")).toBeNaN()
      expect(parseLandArea("1-2-x-1", "ropani")).toBeNaN()
      expect(parseLandArea("1--3-1", "ropani")).toBeNaN()
      expect(parseLandArea("abc", "ropani")).toBeNaN()
      expect(parseLandArea("", "ropani")).toBeNaN()
      expect(parseLandArea("1-2-3-1", "tola" as "ropani")).toBeNaN()
      expect(parseLandArea(null as unknown as string, "ropani")).toBeNaN()
    })

    test("reads a 100 000-character hostile string in linear time", () => {
      const started = performance.now()
      expect(parseLandArea("-".repeat(100000), "ropani")).toBeNaN()
      expect(parseLandArea("9".repeat(100000) + "-x-1-1", "ropani")).toBeNaN()
      expect(performance.now() - started).toBeLessThan(1000)
    })
  })
})
